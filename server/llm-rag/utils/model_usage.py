import csv
import os
from datetime import date

from constants.model_usage import CSV_FILE, MODEL_LIMITS


def read_model_usage():
    usage = {}
    today_str = date.today().isoformat()

    # Create file if it doesn't exist or is empty
    if not os.path.exists(CSV_FILE) or os.stat(CSV_FILE).st_size == 0:
        os.makedirs(os.path.dirname(CSV_FILE), exist_ok=True)
        with open(CSV_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['model_name', 'date', 'used_requests'])
            for model in MODEL_LIMITS:
                writer.writerow([model, today_str, 0])

    # Now read from the file
    with open(CSV_FILE, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            key = (row['model_name'], row['date'])
            usage[key] = int(row['used_requests'])

    return usage


def update_model_usage(model_name):
    usage = read_model_usage()
    today_str = date.today().isoformat()
    key = (model_name, today_str)

    usage[key] = usage.get(key, 0) + 1

    with open(CSV_FILE, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['model_name', 'date', 'used_requests'])
        for (model, d), count in usage.items():
            writer.writerow([model, d, count])


def get_available_model():
    usage = read_model_usage()
    today_str = date.today().isoformat()

    for model, limit in MODEL_LIMITS.items():
        used = usage.get((model, today_str), 0)
        if used < limit:
            return model
    raise RuntimeError("All models exhausted for today.")
