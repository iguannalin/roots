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
  let treeIndex = 0;

  function drawGrass(x, y) {
    const dot = document.createElement("span");
    dot.className = "grass";
    dot.innerText = grasses[getRandomInt(0, grasses.length)]; // 
    dot.style.top = y-7+"px";
    dot.style.left = x-7+"px";
    container.appendChild(dot);
  }

  function drawTree() {
    let treeSpans = Array.from(document.getElementsByClassName("tree"));
    if (treeSpans.length > 15) {
      const tree = treeSpans[treeIndex];
      const lastTree = treeSpans[(treeIndex*15)%treeSpans.length]; // let's say every tree should consist of ~15 elems
      tree.style.top = +(lastTree.style.top.split("px")[0]) - getRandomInt(1, 10) + "px";
      tree.style.left = +(lastTree.style.left.split("px")[0]) + ((Math.random()>0.5?-1:1) * getRandomInt(0, 5)) + "px";
      tree.innerText = trees[getRandomInt(0, trees.length)];
      treeIndex += 1;
    }
    if (treeSpans.length > 100) {
      treeSpans[0].remove();
      
      treeIndex -= 1;
    }
  }

  function removeGrass() {
    const grassSpans = Array.from(document.getElementsByClassName("grass"));
    if (grassSpans.length > 175) { 
      let grass = grassSpans[0];
      grass.className = "tree";
      grass.innerText = "";
    }
  }

  function handleTouch(e, isMobile = false) {
    e.preventDefault();
    let [x, y] = (!isMobile) ? [e.pageX, e.pageY] : [e.targetTouches[0].pageX, e.targetTouches[0].pageY];
    drawGrass(x, y);
    let getX = (s=0,r) => x + r * Math.sin(s);
    let getY = (c=0,r) => y + r * Math.cos(c);
    let radius = 2;
    let s = 0; let c = 0;
    let interval = setInterval(() => {
      if (Math.random()>0.45) return; // skips sometimes
      radius = getRandomInt(10, 50);
      drawGrass(getX(s+=1,radius), getY(c+=1,radius));
      removeGrass();
      drawTree();
    }, 15);
    (!isMobile) ? onmouseup = () => {clearInterval(interval);} : ontouchend = () => {clearInterval(interval);};
  }

  document.addEventListener('mousedown', handleTouch, {passive: false});
  document.addEventListener('touchstart', (e) => handleTouch(e, true), {passive: false});
  // ontouchstart = (e) => handleTouch(e, true); // doesn't work if you want to get rid of auto text-select on safari (via e.preventDefault())
});