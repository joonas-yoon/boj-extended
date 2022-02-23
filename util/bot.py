from time import sleep
from random import randint
from selenium import webdriver
from selenium.webdriver.common.by import By
from datetime import datetime
import sys
import json

try:
    options = webdriver.ChromeOptions()
    options.add_argument('--lang=ko_KR')
    options.add_argument('--headless')
    options.add_argument('--window-size=1920x1080')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')

    # chrome driver
    driver = webdriver.Chrome('chromedriver', options=options)
    driver.implicitly_wait(3)
    assert driver is not None

    # access BOJ
    driver.get('https://www.acmicpc.net/problemset')
    sleep(10) # wait 10 seconds for page load

    paginator = driver.find_element_by_class_name('pagination')
    print('paginator', paginator)
    page_li = paginator.find_elements_by_tag_name('li')
    print('page_li', page_li)
    pages = len(page_li)
    print('total pages:', pages)

    problems = {}
    l = -1
    for page in range(pages):
        logging = l != page * 10 // pages
        if logging:
            per = '{:.2f}%'.format(100 * page / pages)
            print(f'\n{page} page ({per})', '=' * (30 - len(per)))
            l = page * 10 // pages
        driver.get('https://www.acmicpc.net/problemset/{}'.format(page + 1))
        table = driver.find_element(By.ID, 'problemset')
        rows = table.find_elements_by_tag_name('tr')[1:]
        l2 = 0
        for row in rows:
            pid, name = row.find_elements_by_tag_name('td')[:2]
            problems[pid.text] = name.text
            if logging and l2 < 5:
                print(f'{pid.text} {name.text}')
                l2 += 1
        if logging and l2 != len(rows):
            print('...')
        # sleep randomly [500ms, 1000ms]
        sleep(randint(500, 1000) / 1000)

    # export json as file
    with open('db.json', 'w') as f:
        db = {
            'problems': problems,
            'last_updated': str(datetime.now())
        }
        json.dump(db, f, ensure_ascii=False, indent=2, separators=(',', ': '))

except Exception as e:
    print(e)
    driver.quit()
    sys.exit(str(e))

finally:
    driver.quit()
