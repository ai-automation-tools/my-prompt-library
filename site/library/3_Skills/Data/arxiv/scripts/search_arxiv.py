#!/usr/bin/env python3
"""Query arXiv's Atom API and print compact, readable results."""

from __future__ import annotations

import argparse
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ATOM_NS = {"a": "http://www.w3.org/2005/Atom"}
TOTAL_RESULTS = "{http://a9.com/-/spec/opensearch/1.1/}totalResults"


def build_url(args: argparse.Namespace) -> str:
    params: dict[str, str] = {}
    if args.ids:
        params["id_list"] = args.ids
    else:
        parts: list[str] = []
        if args.query:
            parts.append(f"all:{urllib.parse.quote(args.query)}")
        if args.author:
            parts.append(f"au:{urllib.parse.quote(args.author)}")
        if args.category:
            parts.append(f"cat:{args.category}")
        if not parts:
            raise SystemExit("Provide a query, --author, --category, or --id.")
        params["search_query"] = "+AND+".join(parts)
        params["max_results"] = str(args.max)
        params["sortBy"] = {
            "relevance": "relevance",
            "date": "submittedDate",
            "updated": "lastUpdatedDate",
        }[args.sort]
        params["sortOrder"] = "descending"
    return "https://export.arxiv.org/api/query?" + "&".join(f"{k}={v}" for k, v in params.items())


def fetch_xml(url: str) -> ET.Element:
    req = urllib.request.Request(url, headers={"User-Agent": "skillsmp-arxiv/1.0"})
    with urllib.request.urlopen(req, timeout=20) as response:
        return ET.fromstring(response.read())


def format_entry(index: int, entry: ET.Element) -> str:
    title = entry.find("a:title", ATOM_NS).text.strip().replace("\n", " ")
    raw_id = entry.find("a:id", ATOM_NS).text.strip().split("/abs/")[-1]
    base_id = raw_id.split("v")[0]
    authors = ", ".join(author.find("a:name", ATOM_NS).text for author in entry.findall("a:author", ATOM_NS))
    published = entry.find("a:published", ATOM_NS).text[:10]
    updated = entry.find("a:updated", ATOM_NS).text[:10]
    summary = entry.find("a:summary", ATOM_NS).text.strip().replace("\n", " ")
    categories = ", ".join(cat.get("term") for cat in entry.findall("a:category", ATOM_NS))
    lines = [
        f"{index}. [{raw_id}] {title}",
        f"   Authors: {authors}",
        f"   Published: {published} | Updated: {updated}",
        f"   Categories: {categories or 'n/a'}",
        f"   Abstract: {summary[:240]}{'...' if len(summary) > 240 else ''}",
        f"   Abs: https://arxiv.org/abs/{base_id}",
        f"   PDF: https://arxiv.org/pdf/{base_id}",
    ]
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Search arXiv and print compact results.")
    parser.add_argument("query", nargs="?", help="Free-text search query")
    parser.add_argument("--author", help="Author name")
    parser.add_argument("--category", help="arXiv category, e.g. cs.AI")
    parser.add_argument("--id", dest="ids", help="Comma-separated arXiv IDs")
    parser.add_argument("--max", type=int, default=5, help="Maximum number of results")
    parser.add_argument(
        "--sort",
        choices=("relevance", "date", "updated"),
        default="relevance",
        help="Sort mode",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    root = fetch_xml(build_url(args))
    entries = root.findall("a:entry", ATOM_NS)
    if not entries:
        print("No results found.")
        return 0

    total = root.find(TOTAL_RESULTS)
    if total is not None:
        print(f"Found {total.text} results (showing {len(entries)})\n")

    for index, entry in enumerate(entries, start=1):
        print(format_entry(index, entry))
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
