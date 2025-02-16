from time import sleep
from random import randint
from datetime import datetime

import os
import json
import requests
import logging


INTERVAL = 100
API_HOST = 'https://solved.ac/api/v3'


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')

stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)


def sleep_rand(min_ms, max_ms):
    sleep(randint(min_ms, max_ms) / 1000)


def get_problems_count():
    res = requests.get(f'{API_HOST}/site/stats').json()
    return res['problemCount']


def get_problem_details(ids):
    pids = '%2C'.join(list(map(str, ids)))
    try:
        for err in range(5):
            response = requests.get(f'{API_HOST}/problem/lookup?problemIds={pids}')
            status_code = response.status_code
            if status_code == 429:
                logger.info('[Awating next retry....]')
                sleep(5 * 60)
                continue
            else:
                return response.json()
        return None
    except Exception as err:
        logger.error(err)
        return None


def is_time_over(start_date):
    return (datetime.now() - start_date).seconds / 3600 > 1.5

total_count = get_problems_count()
count = 0
offset = 1000
problems = {}
prev_count = -10 ** 10
start_date = datetime.now()
total_tries = max(5, int(total_count / INTERVAL * 1.2))

logger.info(f'total problems: {total_count}')
logger.info(f'total tries: {total_tries}')

for tries in range(total_tries):
    if is_time_over(start_date):
        logger.error('It takes too long')
        exit(1)

    rows = get_problem_details(range(offset, offset + INTERVAL))

    if rows == None:
        exit(1)

    rows_count = len(rows)
    count += rows_count

    is_last = count >= total_count
    is_print = is_last or (count - prev_count > (total_count // 20))

    if is_print:
        logger.info('=' * 80 + '\n')
        logger.info('# Collect {} items ... ({:.2f}%)\n'.format(
            count, count / total_count * 100)
        )

    result = {}
    for i, row in enumerate(rows):
        pid = int(row['problemId'])
        title = row['titleKo']
        result[pid] = dict(
          title=title,
          level=row['level']
        )
        if is_print:
            if i < 5 or rows_count - 5 <= i:
                logger.info(f'{pid} {title}')
            elif i == 5:
                logger.info('...')

    problems.update(result)

    if is_last:
        break

    if is_print:
        prev_count = count

    offset += INTERVAL
    sleep_rand(100, 1000)


with open(os.path.join('db', 'v1.1.json'), 'w', encoding='utf-8') as f:
    db = {
        'version': '1.1.0',
        'last_updated': str(datetime.now()),
        'problems': problems
    }
    json.dump(db, f, ensure_ascii=False, indent=2, separators=(',', ': '))
