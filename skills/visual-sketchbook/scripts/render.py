import sys, json, asyncio
from playwright.sync_api import sync_playwright
html, out = sys.argv[1], sys.argv[2]
import os; os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome')
    for W in (1280, 400):
        pg = b.new_page(viewport={'width':W,'height':800})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('file://'+html, wait_until='domcontentloaded', timeout=60000); pg.wait_for_timeout(2500)
        ids = pg.evaluate('window.SKETCH_PAGES')
        rep=[]
        for i,id in enumerate(ids):
            pg.evaluate(f"location.hash='{id}'"); pg.wait_for_timeout(250)
            ov = pg.evaluate("[document.documentElement.scrollWidth, document.getElementById('stage').scrollWidth, innerWidth]")
            if ov[0]>ov[2] or ov[1]>ov[2]: rep.append((id,ov))
            pg.screenshot(path=f"{out}/{W}_{i:02d}.png", full_page=False)
        print(W, 'pages', len(ids), 'overflow', rep, 'errors', errs)
    b.close()
