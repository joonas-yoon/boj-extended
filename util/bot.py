from time import sleep
from random import randint
from datetime import datetime

import json
import requests

MAX_TRIES = 500
INTERVAL = 100
API_HOST = 'https://solved.ac/api/v3'


def sleep_rand(min_ms, max_ms):
    sleep(randint(min_ms, max_ms) / 1000)


def get_problems_count():
  res = requests.get(f'{API_HOST}/site/stats').json()
  return res['problemCount']


def get_problem_details(ids):
  pids = '%2C'.join(list(map(str, ids)))
  try:
      return requests.get(f'{API_HOST}/problem/lookup?problemIds={pids}').json()
  except:
      return None


total_count = get_problems_count()
count = 0
offset = 1000
problems = {}
prev_count = -10 ** 10

print('total problems:', total_count)

for tries in range(MAX_TRIES):
  rows = get_problem_details(range(offset, offset + INTERVAL))
  
  for err in range(MAX_TRIES):
    if rows != None: break
    sleep(5 * 60 * 1000)
    rows = get_problem_details(range(offset, offset + INTERVAL))

  rows_count = len(rows)
  count += rows_count

  is_last = count >= total_count
  is_print = is_last or (count - prev_count > (total_count // 10))

  if is_print:
    print('=' * 30 + '\n')
    print('# Collect {} items ... ({:.2f}%)\n\n'.format(count, count / total_count * 100))
  
  result = {}
  for row in rows:
    pid = int(row['problemId'])
    title = row['titleKo']
    result[pid] = title
    if is_print:
      print(pid, title)

  problems.update(result)

  if is_last:
    break

  if is_print:
    prev_count = count
    
  offset += INTERVAL
  sleep_rand(100, 1000)


with open('db.json', 'w') as f:
    db = {
        'version': '1.0.0',
        'last_updated': str(datetime.now()),
        'problems': problems
    }
    json.dump(db, f, ensure_ascii=False, indent=2, separators=(',', ': '))
