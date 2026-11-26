import sys, io
from playwright.sync_api import sync_playwright
from pypdf import PdfWriter, PdfReader
html,out=sys.argv[1],sys.argv[2]
w=PdfWriter()
with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome')
    pg=b.new_page(viewport={'width':1280,'height':905},color_scheme='light')
    pg.emulate_media(media='screen',color_scheme='light')
    pg.goto('file://'+html, wait_until='domcontentloaded', timeout=60000); pg.wait_for_timeout(2500)
    pg.add_style_tag(content=".bar .btn,.count,.dots,.fig{animation:none}{display:none!important}.card{animation:none!important}")
    ids=pg.evaluate('window.SKETCH_PAGES')
    for id in ids:
        pg.evaluate(f"location.hash='{id}'"); pg.wait_for_timeout(250)
        pg.evaluate("""()=>{const st=document.getElementById('stage'),pgEl=document.querySelector('.page:not([hidden])');pgEl.style.zoom=1;
          if(st.scrollHeight>st.clientHeight){pgEl.style.zoom=Math.max(.6,st.clientHeight/st.scrollHeight*0.98)}}""")
        pdf=pg.pdf(width='1280px',height='905px',print_background=True,margin={'top':'0','bottom':'0','left':'0','right':'0'},page_ranges='1')
        w.append(PdfReader(io.BytesIO(pdf)))
    b.close()
w.add_metadata({'/Title':sys.argv[3] if len(sys.argv)>3 else 'Visual sketchbook'})
w.write(out); print('pages',len(w.pages))
