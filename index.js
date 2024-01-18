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
  const grasses = ["⺌", "丶", "⺍", "灬", "艹", "⺮"];//, "冫", "氵"];
  const touchPoints = [];
  const trees = ["木", "林", "森"];//, "冫", "氵"];
  let grassIndex = 0;
  let treeIndex = 0;
  let threshold = 150;
  let treeThreshold = 25;

  let timeout = (dot) => dot.innerText = "";

  function drawGrass(x, y) {
    if (Math.random()>0.4) return; // skips sometimes
    let dot;
    const grassSpans = Array.from(document.getElementsByClassName("grass"));
    if (grassSpans.length > threshold) { // only the threshold amount of grass spans allowed
      dot = grassSpans[grassIndex];
      dot.style.top = y-7+"px";
      dot.style.left = x-7+"px";
      grassIndex = grassIndex >= threshold ? 0 : grassIndex + 1;
      if (Math.random()>0.4) setTimeout(drawTree, getRandomInt(2500, 7000));
      // clearTimeout(timeout);
    }
    else {
      dot = document.createElement("span");
      dot.className = "grass";
      dot.style.top = y-7+"px";
      dot.style.left = x-7+"px";
      container.appendChild(dot);
      // if (Math.random()>0.2) 
      // setTimeout(timeout(dot), getRandomInt(8000, 10000)); // disappear after a while
    }
    dot.innerText = grasses[getRandomInt(0, grasses.length)]; // 
  }

  function drawTree() {
    // if (Math.random()>0.6) return; // skips sometimes
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
    if (center.ct > treeThreshold && treeIndex < touchPoints.length) treeIndex += 1;
  }
  
  function handleTouch(e, isMobile = false) {
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

  document.addEventListener('mousedown', handleTouch, {passive: false});
  document.addEventListener('touchstart', (e) => handleTouch(e, true), {passive: false});
  // ontouchstart = (e) => handleTouch(e, true); // doesn't work if you want to get rid of auto text-select on safari (via e.preventDefault())
});