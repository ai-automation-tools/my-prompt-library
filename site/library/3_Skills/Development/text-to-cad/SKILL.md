---
name: text-to-cad
description: A library of agent skills for generating, editing, sourcing, and exporting CAD and robot-description files (STEP, STL, 3MF, GLB, DXF, URDF, SRDF, SDF, G-code) from plain-language or image requests, plus browser-based CAD preview and slicer/print-job integration. Use when a task needs a coding agent to produce fabricatable or simulation-ready 3D/CAD artifacts rather than just code.
source: https://github.com/earthtojake/text-to-cad
author: earthtojake
repository: https://github.com/earthtojake/text-to-cad
stars: 13700
forks: 1400
updated: 2026-08-19
license: MIT
upstream:
  match: unknown
  declared: "https://github.com/earthtojake/text-to-cad"
  checked: 2026-08-26
---

# Text to CAD

Turns a coding agent into a CAD/CAE/CAM-capable engineer, bridging natural-language part descriptions and fabrication-ready output formats.

## Prerequisites

- Python 3.11+
- For G-code output: a real slicer CLI (the skill wraps slicer profiles rather than reimplementing slicing)
- For step.parts sourcing, SendCutSend validation, or Bambu Labs print-job management: accounts or API access to those services, if used

## When To Use

- Turning a text or image description into a parametric or mesh CAD model
- Producing 2D DXF cut layouts for laser/CNC fabrication
- Writing robot description files (URDF for structure/kinematics, SRDF for MoveIt planning groups) for simulation or motion planning
- Slicing a mesh to G-code with an FDM profile, or previewing CAD/robot files directly in-browser
- Sourcing off-the-shelf hardware (screws, bearings, motors) to complete a design

## Usage

1. Describe the part or assembly in plain language (or supply a reference image); the CAD skill generates or edits the model.
2. Preview the result with the browser-based CAD Viewer before committing to an export format.
3. Export to the format the downstream step needs: STEP/STL/3MF/GLB for general CAD interchange, DXF for 2D cut layouts, URDF/SRDF/SDF for robotics.
4. For fabrication, validate the file with SendCutSend's pre-upload checks, then hand off; for 3D printing, slice to G-code with the appropriate FDM profile and, if using Bambu Labs, push the job directly.
5. Use the step.parts skills mid-design to source real off-the-shelf components instead of modeling fasteners and motors from scratch.

## Examples

- "Design a mounting bracket for a NEMA17 stepper, 4 M3 holes, export STEP" → the CAD skill generates geometry and exports STEP for import into a full CAD package.
- "Turn this robot arm sketch into a URDF with joint limits" → the URDF skill writes links, joints, limits, and inertials, ready for a simulator.
- "Slice this STL for a 0.2mm layer PLA print and send it to my Bambu printer" → the G-code skill slices with an FDM profile and the Bambu Labs skill manages the print job.

## Best Practices

- Preview before export — catching geometry errors in the CAD Viewer is cheaper than catching them after slicing or fabrication.
- Prefer step.parts sourcing for standard hardware over generating custom geometry for parts that are already commodity items.
- Run SendCutSend's validation before any real fabrication order, not after.
- Treat the "Implicit CAD" raymarched-geometry skill as experimental; verify output before relying on it for fabrication-critical parts.

## References

- Repository: https://github.com/earthtojake/text-to-cad
