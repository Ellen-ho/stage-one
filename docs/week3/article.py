from urllib.request import urlopen, Request
from bs4 import BeautifulSoup  
import csv
from datetime import datetime
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def fetch_page(url):
    headers = {
        "cookie":"over18=1",
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    req = Request(url=url, headers=headers)
    with urlopen(req) as response:
        page = response.read().decode('utf-8')
    return BeautifulSoup(page, 'html.parser')

def get_articles(soup):
    articles = []
    titles = soup.find_all("div", class_="title")
    for title in titles:
        if title.find('a'):  
            href = "https://www.ptt.cc" + title.find('a')['href']
            title_text = title.find('a').text.strip()
            articles.append((title_text, href))
    return articles

def get_likes_dislikes(article_url):
    soup = fetch_page(article_url)
    score = 0
    pushes = soup.find_all('div', class_='push')
    for push in pushes:
        if push.find('span', class_='push-tag'):
            if '推' in push.find('span', class_='push-tag').text:
                score += 1
            elif '噓' in push.find('span', class_='push-tag').text:
                score -= 1
    return score

def get_publish_time(article_url):
    try:
        soup = fetch_page(article_url)
        metalines = soup.find_all('div', class_='article-metaline')
        if len(metalines) >= 3:
            time_text = metalines[2].find('span', class_='article-meta-value').text
            publish_time = datetime.strptime(time_text, '%a %b %d %H:%M:%S %Y')
            return publish_time.strftime('%a %b %d %H:%M:%S %Y')
    except Exception:
        pass
    return ""

def scrape_pages(start_url):
    current_url = start_url
    all_articles = []
    for _ in range(3): 
        soup = fetch_page(current_url)
        articles = get_articles(soup)
        for title, href in articles:
            likes_dislikes = get_likes_dislikes(href)
            publish_time = get_publish_time(href)
            all_articles.append((title, likes_dislikes, publish_time))
        next_link = soup.find("a", string="‹ 上頁")  
        if next_link:
            current_url = "https://www.ptt.cc" + next_link['href']
        else:
            break
    return all_articles

def save_to_csv(articles):
    with open('article.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['ArticleTitle', 'Like/DislikeCount', 'PublishTime'])
        for title, likes_dislikes, publish_time in articles:
            writer.writerow([title, likes_dislikes, publish_time])

base_url = "https://www.ptt.cc/bbs/Lottery/index.html"
articles = scrape_pages(base_url)
save_to_csv(articles)

print("Complete data scraping.")