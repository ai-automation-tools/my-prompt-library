---
title: "Rust CLI Network Scanner"
tags: ["it", "build-apps", "rust", "network", "scanner"]
category: "IT"
subcategory: "Build_Apps"
---
# Rust CLI Network Scanner

Build a fast, concurrent, and cross-platform Command-Line Interface (CLI) network scanner tool using Rust to discover active devices and open ports on a local network.

---

## Role & Context

You are a systems programmer and network security tool developer leveraging Rust's performance and memory safety to build a reliable utility.

**Tech Stack (Fixed):**
- **Language:** Rust (Stable)
- **CLI Framework:** Clap (v4)
- **Networking:** std::net, pnet (for low-level packet crafting if needed), or tokio (for async TCP/UDP connections)
- **Concurrency:** Rayon (for data parallelism) or Tokio (async runtime)
- **Build Tool:** Cargo

---

## Product Requirements

### Core Features

#### 1) Host Discovery (Ping Sweep)
Identify active devices on a subnet.
- Send ICMP Echo Requests (Ping) to a range of IP addresses (e.g., `192.168.1.0/24`).
- Support ARP scanning for local subnets (faster and more reliable than ICMP).
- Output discovered IP addresses and MAC addresses (if ARP is used).

#### 2) Port Scanning
Identify open services on discovered hosts.
- Perform TCP Connect scans on a specified list or range of ports (e.g., 1-1024 or 80,443).
- Implement a SYN stealth scan (requires raw sockets/root privileges).
- Timeout handling for unresponsive ports to maintain speed.

#### 3) Output & Reporting
Present findings clearly to the user.
- Console output with colors (using `colored` or `crossterm` crates).
- Support exporting results to JSON or CSV formats.
- Verbose mode (`-v`) for detailed progress and debugging.

---

## Technical Requirements

### Architecture
A highly concurrent CLI application. The main thread parses arguments and delegates scanning tasks to a thread pool (Rayon) or asynchronous tasks (Tokio). The application must handle thousands of simultaneous connections without exhausting file descriptors.

### Data Model (Internal Structs)
- **ScanTarget:** IPAddress (String or `std::net::IpAddr`), Ports (Vec<u16>)
- **ScanResult:** Host (IPAddress), Status (Up/Down), OpenPorts (Vec<u16>), OSGuess (optional String)
- **Config:** TargetCIDR, PortRange, TimeoutMs, OutputFormat, Verbosity

### CLI Design (Clap)
- `netscan -t 192.168.1.0/24 -p 1-1000 --json output.json`
- `netscan --target 10.0.0.1 --ports 80,443 --stealth`

### Security Requirements
- The tool must clearly communicate when elevated privileges (root/Administrator) are required (e.g., for raw sockets or SYN scans).
- Do not execute arbitrary code; strictly handle network packets.
- Gracefully handle malformed packets or unexpected network responses without panicking.

### Performance Requirements
- Scan a full `/24` subnet for the top 1000 ports in under 10 seconds.
- Effectively manage OS socket limits (ulimit) dynamically or through configuration batching.

---

## Implementation Details

### Concurrency Model
- Use Tokio's asynchronous runtime for TCP connect scanning, allowing non-blocking I/O operations.
- Limit concurrency using a semaphore (`tokio::sync::Semaphore`) to avoid "Too many open files" errors.
- Use a `mpsc` (multi-producer, single-consumer) channel to send results back to the main thread for real-time printing or aggregation.

### Cross-Platform Support
- Ensure the tool compiles and runs on Linux, macOS, and Windows. Note that raw socket implementation (`pnet`) might require OS-specific handling or libraries (like Npcap on Windows).

---

## UI/UX Requirements

### Key Pages/Views
- Terminal interface only.
- Implement a progress bar (using `indicatif` crate) showing the number of hosts/ports scanned versus total.

### Design Principles
- Meaningful error messages (e.g., "Error: Permission denied. SYN scans require root privileges").
- Sensible defaults (e.g., if no ports are specified, scan the top 1000).
- Clean, aligned output (tab-separated or formatted tables for terminal display).

---

## Testing & Validation

### Unit Tests
- Test CIDR parsing and IP range generation logic.
- Test port string parsing (e.g., turning "80,443,1000-1010" into a `Vec<u16>`).

### Integration Tests
- Run a local TCP server (`std::net::TcpListener`) on a random port and assert the scanner finds it open.

### Manual Tests
- Verify behavior against known network topologies (e.g., a home router and connected devices).
- Verify JSON output format against a JSON schema.

---

## Deployment & Operations

### Environment Setup
- Standard Rust toolchain (`rustup`).

### Deployment Steps
1. Build release binaries: `cargo build --release`.
2. Cross-compile for different targets using `cross` or GitHub Actions matrix builds (x86_64-linux, aarch64-linux, x86_64-windows, x86_64-apple-darwin).
3. Publish to `crates.io` or provide pre-compiled binaries via GitHub Releases.

### Monitoring & Logging
- Use `env_logger` and the `log` crate for internal debug logging (`RUST_LOG=debug netscan ...`).

---

## Documentation Requirements

Generate:
- [ ] README.md with installation instructions (`cargo install` or downloading binaries)
- [ ] Usage examples (basic scan, aggressive scan, exporting results)
- [ ] Troubleshooting section for common errors (like permission denied on raw sockets)

---

## Constraints & Limitations

- Tool must be a single static binary with no external runtime dependencies.
- Memory usage should remain under 50MB during typical scans.
- Some advanced scan types (SYN/ACK) may require OS-specific logic.

---

## Success Criteria

The project is complete when:
- [ ] The CLI parses arguments correctly and validates input (e.g., valid IP format).
- [ ] It accurately identifies hosts that are "up" using ICMP or ARP.
- [ ] It accurately identifies open TCP ports on those hosts.
- [ ] Concurrency limits prevent the OS from killing the process due to socket exhaustion.
- [ ] A test suite verifies core parsing and scanning logic.

---

## Tags

`#project` `#rust` `#cli` `#networking` `#security` `#build` `#tool`

---

**Version:** 1.0 | **Created:** 2024-03-05 | **Updated:** 2024-03-05