"""Generate seamless, deterministic two-scale film grain. No source images, libraries or private assets."""
import random, struct, zlib
from pathlib import Path
w=h=192
rng=random.Random(6202)
fine=[rng.gauss(0,1) for _ in range(w*h)]
coarse=[rng.gauss(0,1) for _ in range((w//3)*(h//3))]
def bilinear(x,y):
 n=w//3
 x/=3; y/=3
 ix,iy=int(x),int(y);fx,fy=x%1,y%1
 return sum(coarse[((iy+j)%n)*n+(ix+i)%n]*(fx if i else 1-fx)*(fy if j else 1-fy) for i in (0,1) for j in (0,1))
def chunk(tag,b):
 return struct.pack('>I',len(b))+tag+b+struct.pack('>I',zlib.crc32(tag+b)&0xffffffff)
for name,bright,dark in [('paper',.105,.032),('night',.024,.12)]:
 raw=bytearray()
 for y in range(h):
  raw.append(0)
  for x in range(w):
   z=max(-2.7,min(2.7,.87*fine[y*w+x]+.10*bilinear(x,y)))
   val=255 if z>=0 else 0;alpha=min(255,round(255*abs(z)*(bright if z>=0 else dark)))
   raw.extend([val,val,val,alpha])
 img=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(raw,9))+chunk(b'IEND',b'')
 Path('public/assets/grain-'+name+'.png').write_bytes(img)
