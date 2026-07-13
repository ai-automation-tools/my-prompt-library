---
name: odds-modeling
description: "Build predictive models for sports and event outcomes using statistical methods, ELO ratings, regression, Monte Carlo simulation, and machine learning. Use when creating power rankings, projecting game outcomes, estimating win probabilities, or building a quantitative edge. Also trigger for 'prediction model', 'ELO rating', 'power rankings', 'win probability', 'Monte Carlo', 'regression model', 'expected goals', or 'predictive analytics'."
---

# Odds Modeling — Predictive Models for Betting Markets

Build quantitative models that convert raw data into probability estimates — the foundation for finding value in any betting market.

## When to Use This Skill

**USE when:**
- Building a model to estimate event probabilities
- Creating ELO / power ranking systems
- Running Monte Carlo simulations for tournaments or seasons
- Evaluating which variables are predictive vs. noise
- Backtesting a model against historical results

**DON'T USE when:**
- Understanding bet types and lines → use `/sports-betting`
- Sizing bets after you have a probability → use `market-mechanics-betting`
- Analyzing line movement → use `/market-sentiment`

## Step 1: Choose Your Modeling Approach

### Model Complexity Spectrum

```
SIMPLE                                                    COMPLEX
  │                                                          │
  ELO / Glicko    Regression    Ensemble      Neural Nets
  Power Ratings   (Logistic,    (Random       Deep Learning
  Pythagorean     Poisson)      Forest, XGB)  Transformers
  │                                                          │
  Fast iteration   Good balance  More accurate  Diminishing
  Easy to debug    Interpretable Harder to      returns,
  Good baseline    Feature eng.  interpret      overfitting risk
```

### Approach Selection Guide

| Data Available | Best Starting Point | Why |
|---------------|---------------------|-----|
| Win/loss records only | ELO / Glicko-2 | Minimal data requirement |
| Box scores / stats | Regression (linear/logistic) | Interpretable coefficients |
| Large historical dataset | Ensemble methods (XGBoost) | Handles nonlinearity |
| Play-by-play data | Poisson / expected goals | Event-level modeling |
| Limited history (<2 seasons) | Bayesian methods | Handles uncertainty well |
| Real-time / in-game | State-space models | Tracks momentum |

## Step 2: ELO & Rating Systems

### Basic ELO Implementation

```python
class EloRating:
    def __init__(self, k=20, home_advantage=65):
        self.ratings = {}  # team -> rating
        self.k = k
        self.home_advantage = home_advantage
        self.default_rating = 1500

    def get_rating(self, team):
        return self.ratings.get(team, self.default_rating)

    def expected_score(self, rating_a, rating_b):
        """Win probability for team A"""
        return 1 / (1 + 10 ** ((rating_b - rating_a) / 400))

    def predict(self, home, away):
        """Return win probability for home team"""
        home_elo = self.get_rating(home) + self.home_advantage
        away_elo = self.get_rating(away)
        return self.expected_score(home_elo, away_elo)

    def update(self, home, away, home_score, away_score):
        """Update ratings after a game"""
        home_elo = self.get_rating(home) + self.home_advantage
        away_elo = self.get_rating(away)

        expected_home = self.expected_score(home_elo, away_elo)
        actual_home = 1 if home_score > away_score else (0.5 if home_score == away_score else 0)

        # Margin of victory multiplier (optional)
        mov = abs(home_score - away_score)
        mov_mult = math.log(max(mov, 1) + 1) * (2.2 / (2.2 + 0.001 * abs(home_elo - away_elo)))

        update = self.k * mov_mult * (actual_home - expected_home)

        self.ratings[home] = self.get_rating(home) + update
        self.ratings[away] = self.get_rating(away) - update
```

### ELO Tuning Parameters

| Parameter | What It Controls | Typical Values |
|-----------|-----------------|---------------|
| **K-factor** | Sensitivity to new results | 15-30 (NFL: 20, NBA: 20, Soccer: 25) |
| **Home advantage** | Rating boost for home team | NFL: 48-65, NBA: 100, Soccer: 60 |
| **Season regression** | Revert to mean between seasons | Regress 1/3 toward 1500 |
| **MOV multiplier** | Weight blowouts more than close games | log(MOV+1) × autocorrelation damper |
| **Initial rating** | Starting point for new teams | 1500 (or league average) |

### Advanced: Glicko-2

```
Glicko-2 adds two dimensions ELO lacks:

RATING DEVIATION (RD):
  Uncertainty in the rating
  New teams: high RD (uncertain)
  Active teams: low RD (confident)
  Inactive teams: RD increases over time
  → More weight given to results against well-known opponents

VOLATILITY (σ):
  Expected fluctuation in rating
  High σ: team performance is inconsistent
  Low σ: team performs predictably
  → Adjusts K-factor automatically per team
```

## Step 3: Regression Models

### Logistic Regression (Win Probability)

```python
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import TimeSeriesSplit

# Feature engineering
features = [
    'elo_diff',           # Pre-game ELO difference
    'rest_days_diff',     # Rest advantage
    'home_flag',          # Home/away
    'win_pct_last_10',    # Recent form
    'avg_point_diff_5',   # Recent scoring margin
    'injury_impact',      # Weighted injury score
    'travel_distance',    # Miles traveled
]

# Time-series cross-validation (NEVER random split for temporal data)
tscv = TimeSeriesSplit(n_splits=5)
for train_idx, test_idx in tscv.split(X):
    X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
    y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]

    model = LogisticRegression()
    model.fit(X_train, y_train)

    # Evaluate calibration, not just accuracy
    probs = model.predict_proba(X_test)[:, 1]
```

### Poisson Regression (Score Prediction)

```python
# Model each team's scoring as a Poisson process
# Excellent for soccer (expected goals), hockey, baseball

import statsmodels.api as sm

# Features predict goals/runs scored
poisson_model = sm.GLM(
    goals_scored,
    sm.add_constant(features),
    family=sm.families.Poisson()
).fit()

# Predict expected goals for each team
home_xg = poisson_model.predict(home_features)  # e.g., 1.8
away_xg = poisson_model.predict(away_features)  # e.g., 1.2

# Generate scoreline probabilities
from scipy.stats import poisson

max_goals = 8
prob_matrix = np.zeros((max_goals, max_goals))
for h in range(max_goals):
    for a in range(max_goals):
        prob_matrix[h][a] = poisson.pmf(h, home_xg) * poisson.pmf(a, away_xg)

# P(Home win) = sum of cells where h > a
# P(Draw) = sum of diagonal
# P(Away win) = sum of cells where a > h
# P(Over 2.5) = 1 - sum of cells where h+a <= 2
```

## Step 4: Feature Engineering

### Universal Features (Most Sports)

| Feature | Why It's Predictive | Watch For |
|---------|-------------------|-----------|
| **ELO / rating diff** | Best single predictor | Recency bias in K-factor |
| **Home advantage** | Consistently significant | Varies by sport/era (declined post-COVID) |
| **Recent form** | Captures momentum/injuries | Overfitting to small samples |
| **Rest days** | Fatigue affects performance | More impactful in NBA than NFL |
| **Injury report** | Star absence = big impact | Quantify with WAR/VORP, not binary |
| **Head-to-head** | Matchup-specific patterns | Small samples — usually noise |
| **Weather** | Outdoor sports only | Wind > temperature for totals |
| **Travel** | West→East coast disadvantage | Time zone changes matter more than distance |
| **Motivation** | Playoff implications, rivalry | Hard to quantify — proceed cautiously |

### Sport-Specific Features

```
NFL:
  DVOA/EPA per play, turnover rate, red zone %, 3rd down %,
  time of possession, sack rate, QB rating, yards per play

NBA:
  Net rating, pace, eFG%, turnover %, rebound %, free throw rate,
  clutch performance, back-to-back flag, minutes distribution

MLB:
  Starting pitcher FIP/xFIP, bullpen ERA, wOBA, BABIP,
  park factors, platoon splits, lineup construction

SOCCER:
  xG (expected goals), xGA, possession %, PPDA (pressing),
  shots on target, set piece conversion, clean sheet %
```

### Feature Importance Validation

```
ALWAYS CHECK:
  1. Does the feature have predictive power out-of-sample?
     → If it only works in-sample, it's overfit

  2. Is the feature available BEFORE the game?
     → Using post-game stats to predict the game = data leakage

  3. Is the feature stable over time?
     → If it only worked in 2019-2020, it's likely spurious

  4. Does it survive adding to a model with ELO already included?
     → Many features are just proxies for team quality (ELO captures this)

  5. What's the sample size?
     → NFL: 272 games/season — need 3+ seasons minimum
     → NBA: 1,230 games/season — can work with 2 seasons
     → MLB: 2,430 games/season — 1 season may suffice
```

## Step 5: Monte Carlo Simulation

### Season / Tournament Simulation

```python
def simulate_season(model, schedule, n_simulations=10000):
    """Simulate an entire season N times to get probability distributions"""
    results = defaultdict(lambda: {'wins': [], 'playoff_pct': 0, 'champion_pct': 0})

    for sim in range(n_simulations):
        standings = defaultdict(int)  # team -> wins

        for game in schedule:
            home, away = game['home'], game['away']
            win_prob = model.predict(home, away)

            # Add randomness
            if random.random() < win_prob:
                standings[home] += 1
            else:
                standings[away] += 1

        # Determine playoff teams, simulate playoffs
        playoff_teams = get_playoff_teams(standings)
        champion = simulate_playoffs(model, playoff_teams)

        for team, wins in standings.items():
            results[team]['wins'].append(wins)
        for team in playoff_teams:
            results[team]['playoff_pct'] += 1
        results[champion]['champion_pct'] += 1

    # Convert counts to percentages
    for team in results:
        results[team]['playoff_pct'] /= n_simulations
        results[team]['champion_pct'] /= n_simulations
        results[team]['avg_wins'] = np.mean(results[team]['wins'])
        results[team]['win_range'] = (
            np.percentile(results[team]['wins'], 5),
            np.percentile(results[team]['wins'], 95)
        )

    return results
```

### Simulation Output → Betting Value

```
Simulation says:        Chiefs win Super Bowl in 18.2% of simulations
Sportsbook futures:     Chiefs +600 (implied 14.3%)
Edge:                   18.2% - 14.3% = 3.9% → potential value

IMPORTANT CAVEATS:
  - Simulation confidence intervals matter (±2-3% at 10K sims)
  - Your model's inputs may be wrong (garbage in, garbage out)
  - Markets aggregate information from thousands of bettors
  - If your model consistently disagrees with the market,
    the market is usually right — validate before deploying capital
```

## Step 6: Model Evaluation

### Calibration Check

```
Group predictions into buckets and compare predicted vs actual:

| Predicted Prob | # Games | Actual Win % | Calibration |
|---------------|---------|-------------|------------|
| 50-55%        | 150     | 52.0%       | ✓ Good     |
| 55-60%        | 120     | 57.5%       | ✓ Good     |
| 60-65%        | 95      | 63.2%       | ✓ Good     |
| 65-70%        | 60      | 71.7%       | ~ Slightly high |
| 70-75%        | 35      | 62.9%       | ✗ Overconfident |
| 75%+          | 20      | 70.0%       | ✗ Overconfident |

COMMON FINDING: Models are overconfident at extremes
FIX: Shrink predictions toward 50% (regularization / recalibration)
```

### Key Metrics

```
BRIER SCORE:
  BS = (1/N) × Σ(predicted - actual)²
  Perfect = 0, Coin flip (0.5 for everything) = 0.25
  Good sports model: 0.19-0.22
  → See market-mechanics-betting for Brier optimization

LOG LOSS:
  More sensitive to confident wrong predictions than Brier
  Penalizes saying 95% when the event doesn't happen
  → Better for evaluating tail predictions

CLOSING LINE VALUE (CLV):
  The ultimate real-world test
  Compare your model's line to closing market line
  If you consistently beat the close, your model adds value
  → More meaningful than P/L over small samples

AUC-ROC:
  Discrimination ability (can the model separate wins from losses?)
  Random = 0.5, Perfect = 1.0
  Good sports model: 0.68-0.75
```

### Backtesting Rules

```
CRITICAL RULES:
  1. NEVER use future data to predict the past (data leakage)
  2. ALWAYS use time-series splits, not random train/test
  3. ALWAYS account for transaction costs (vig) in profit calculations
  4. ALWAYS test on 2+ full seasons of out-of-sample data
  5. NEVER optimize your model on the same data you test on
  6. REPORT confidence intervals, not just point estimates

BACKTEST STRUCTURE:
  Train:     Seasons 1-3
  Validate:  Season 4 (tune hyperparameters)
  Test:      Season 5+ (final evaluation — touch ONCE)

  If it works on test, paper-trade Season 6 before risking money
```

## Output

Save model documentation to `artifacts/prediction-markets/[sport]-model.md` including:
- Model type and features used
- Training data range and size
- Calibration chart
- Out-of-sample Brier score and CLV
- Known limitations and edge cases

## Guidelines

- **Start with ELO** — it's the best bang-for-complexity ratio; beat it before adding complexity
- **The market is your benchmark** — if your model can't beat closing lines, it doesn't have edge
- **More data beats better algorithms** — 10 years of clean data > fancy ML on 2 years
- Features that feel intuitively important (rivalry, momentum, "clutch gene") are usually noise
- Overfit models look amazing in backtests and lose money live — always hold out test data
- Use `market-mechanics-betting` to size bets once your model finds edge
- Use `/bankroll-management` to survive the inevitable losing streaks
