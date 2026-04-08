import json
from pathlib import Path
import sys

repo_root = Path(__file__).resolve().parents[1]
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))

from api import app


def main() -> None:
    output_path = repo_root / "openapi" / "openapi.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    spec = app.openapi()
    output_path.write_text(json.dumps(spec, indent=2), encoding="utf-8")
    print(f"OpenAPI spec exported to {output_path}")


if __name__ == "__main__":
    main()
