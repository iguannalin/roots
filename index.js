window.addEventListener("load", () => {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  const container = document.getElementById("container");
  const info = document.getElementById("info");
  const details = document.getElementById("details");
  const grasses = ["⺌", "丶", "⺍", "艹", "⺮"]; // grass & "grass" radicals
  const trees = ["木", "林", "森"]; // tree radicals
  const touchPoints = [];
  let isDetailsClicked = false;
  let windowOpen = true;
  let grassIndex = 0;
  let treeIndex = 0;
  let grassmax = 75;
  let treemax = 25;

  function drawGrass(x, y, isCenter=false) {
    if (Math.random()>0.4 && !isCenter) return; // skips sometimes
    let dot;
    const grassSpans = Array.from(document.getElementsByClassName("grass"));
    if (grassSpans.length > grassmax && !isCenter) { // only the max amount of grass spans allowed
      dot = grassSpans[grassIndex];
      dot.style.top = y-7+"px";
      dot.style.left = x-7+"px";
      grassIndex = grassIndex >= grassmax ? 0 : grassIndex + 1;
      if (Math.random()>0.4) setTimeout(drawTree, getRandomInt(2500, 7000));
    }
    else {
      dot = document.createElement("span");
      dot.className = isCenter ? "center" : "grass";
      dot.style.top = y-7+"px";
      dot.style.left = x-7+"px";
      container.appendChild(dot);
    }
    dot.innerText = grasses[getRandomInt(0, grasses.length)];
  }

  function drawTree() {
    if (!touchPoints[treeIndex]) return;
    const tree = document.createElement("span");
    const center = touchPoints[treeIndex];
    tree.className = "tree";
    tree.innerText = trees[getRandomInt(0, trees.length)];
    center.x = +(center.x) + ((Math.random()>0.5?-1:1) * getRandomInt(1,10));
    tree.style.left = center.x + "px";
    center.y -= 1+(Math.random()*8); 
    tree.style.top = center.y + "px";
    center.ct += 1;
    container.appendChild(tree);
    if (center.ct > treemax && treeIndex < touchPoints.length) treeIndex += 1;
  }
  
  function handleTouch(e, isMobile = false) {
    if (windowOpen) {
      windowOpen = false;
      isDetailsClicked = false;
      info.style.display = "none";
      return;
    }
    e.preventDefault();
    let [x, y] = (!isMobile) ? [e.pageX, e.pageY] : [e.targetTouches[0].pageX, e.targetTouches[0].pageY];
    drawGrass(x, y, true);
    let getX = (s=0,r) => x + r * Math.sin(s);
    let getY = (c=0,r) => y + r * Math.cos(c);
    let radius = 2;
    let s = 0; let c = 0;
    for (let i = 0; i < getRandomInt(2,5); i++) {
      touchPoints.push({x:x+(i*Math.random()*25), y:y+(i*Math.random()*25), ct: 0});
    }
    let interval = setInterval(() => {
      radius = getRandomInt(10, 50);
      drawGrass(getX(s+=1,radius), getY(c+=1,radius));
    }, 50);
    (!isMobile) ? onmouseup = () => {clearInterval(interval);} : ontouchend = () => {clearInterval(interval);};
  }

  fetch("info.txt").then((r)=>r.text()).then((d)=>{
    const pre = document.createElement("pre");
    pre.innerHTML = d;
    info.appendChild(pre);
  });
  
  details.onclick = (e) => {
    isDetailsClicked = true;
    windowOpen = true;
    info.style.display = "block";
    e.preventDefault();
  }
  document.addEventListener('mousedown', handleTouch, {passive: false});
  document.addEventListener('touchstart', (e) => handleTouch(e, true), {passive: false});

  // ontouchstart = (e) => handleTouch(e, true); // doesn't work if you want to get rid of auto text-select on safari (via e.preventDefault())
});