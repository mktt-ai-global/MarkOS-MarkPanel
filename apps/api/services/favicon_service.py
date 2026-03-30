import httpx
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import redis
from apps.api.core.config import settings
import logging

logger = logging.getLogger(__name__)

class FaviconService:
    def __init__(self):
        self.redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
        self.cache_ttl = 86400 * 7  # 7 days

    async def get_favicon(self, url: str) -> str:
        # Check cache
        cache_key = f"favicon:{url}"
        try:
            cached = self.redis.get(cache_key)
            if cached:
                return cached
        except Exception as e:
            logger.warning(f"Redis error in FaviconService: {e}")

        favicon_url = await self._fetch_favicon(url)
        
        if favicon_url:
            try:
                self.redis.setex(cache_key, self.cache_ttl, favicon_url)
            except Exception as e:
                logger.warning(f"Redis error in FaviconService: {e}")
        
        return favicon_url

    async def _fetch_favicon(self, url: str) -> str:
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url

        try:
            async with httpx.AsyncClient(timeout=5.0, follow_redirects=True) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Try to find in link tags (icon, shortcut icon, apple-touch-icon)
                    for rel in ['icon', 'shortcut icon', 'apple-touch-icon']:
                        icon_link = soup.find('link', rel=lambda x: x and x.lower() == rel)
                        if icon_link and icon_link.get('href'):
                            return urljoin(url, icon_link.get('href'))
                    
                    # Try generic search for 'icon' in rel
                    icon_link = soup.find('link', rel=lambda x: x and 'icon' in x.lower())
                    if icon_link and icon_link.get('href'):
                        return urljoin(url, icon_link.get('href'))

                # Try /favicon.ico at the root
                parsed_url = urlparse(url)
                base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                favicon_ico_url = urljoin(base_url, '/favicon.ico')
                
                ico_response = await client.head(favicon_ico_url)
                if ico_response.status_code == 200:
                    return favicon_ico_url

        except Exception as e:
            logger.error(f"Error fetching favicon for {url}: {e}")

        return self._get_default_favicon(url)

    def _get_default_favicon(self, url: str) -> str:
        parsed_url = urlparse(url)
        return f"https://www.google.com/s2/favicons?domain={parsed_url.netloc}&sz=64"

favicon_service = FaviconService()

def get_favicon_service():
    return favicon_service
