## Tests

### Setup

**Windows:**
```
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

**macOS / Linux:**
```
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```


### Running Tests

**Windows:**
```
cd backend
.venv\Scripts\Activate.ps1
python -m pytest
```

**macOS / Linux:**
```
cd backend
source .venv/bin/activate
pytest
```