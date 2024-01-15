window.addEventListener("load", () => {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  const container = document.getElementById("container");
  // including:
  // 1) grass & tree radicals
  // 2) radicals that look like grass or trees
  // 3) water radicals bc water makes up everything
  // 4) fire 灬 radical bc that is also a part of nature
  const grasses = ["冫", "氵", "⺌", "丶", "⺍", "灬", "艹", "⺮"];
  const trees = ["冫", "氵", "木", "禾", "米"];

  function drawDot(x, y) {
    const dot = document.createElement("span");
    dot.innerText = grasses[getRandomInt(0, grasses.length)]; // 
    dot.style.top = y-7+"px";
    dot.style.left = x-7+"px";
    container.appendChild(dot);
  }

  function removeGrass() {
    const grasses = Array.from(document.getElementsByTagName("span"));
    if (grasses.length > 250) grasses[0].remove();
  }

  function handleTouch(e, isMobile = false) {
    e.preventDefault();
    let [x, y] = (!isMobile) ? [e.pageX, e.pageY] : [e.targetTouches[0].pageX, e.targetTouches[0].pageY];
    drawDot(x, y);
    let getX = (s=0,r) => x + r * Math.sin(s);
    let getY = (c=0,r) => y + r * Math.cos(c);
    let radius = 2;
    let s = 0; let c = 0;
    let interval = setInterval(() => {
      if (Math.random()>0.45) return; // skips sometimes
      radius = getRandomInt(10, 50);
      drawDot(getX(s+=1,radius), getY(c+=1,radius));
      removeGrass();
    }, 15);
    (!isMobile) ? onmouseup = () => {clearInterval(interval);} : ontouchend = () => {clearInterval(interval);};
  }

  document.addEventListener('mousedown', handleTouch, {passive: false});
  document.addEventListener('touchstart', (e) => handleTouch(e, true), {passive: false});
  // ontouchstart = (e) => handleTouch(e, true); // doesn't work if you want to get rid of auto text-select on safari (via e.preventDefault())
});