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
  const trees = ["冫", "氵", "木", "禾"];
  let treeIndex = 0;
  let isTouching = false;
  let timer = 0;

  function drawGrass(x, y, isCenter) {
    const dot = document.createElement("span");
    dot.className = isCenter ? "treecenter" : "grass";
    dot.innerText = grasses[getRandomInt(0, grasses.length)]; // 
    dot.style.top = y-7+"px";
    dot.style.left = x-7+"px";
    container.appendChild(dot);
  }

  function drawTree() {
    if (Math.random()>0.6) return; // skips sometimes
    const treeSpans = Array.from(document.getElementsByClassName("tree"));
    if (treeSpans.length > 150) { // TODO differentiate time from tree count
      const treeCenterSpans = Array.from(document.getElementsByClassName("treecenter"));
      const treeCenterIndex = Math.floor(treeIndex/25)%treeCenterSpans.length;
      // console.log("length: ", treeCenterSpans.length," index: ", treeCenterIndex, " trees ", treeSpans.length);
      const centerTree = treeCenterSpans[treeCenterIndex];
      const tree = treeSpans[0];
      tree.style.top = +(centerTree.style.top.split("px")[0]) - getRandomInt(10,150) + "px";
      tree.style.left = +(centerTree.style.left.split("px")[0]) + ((Math.random()>0.5?-1:1) * getRandomInt(1,10)) + "px";
      tree.innerText = trees[getRandomInt(0, trees.length)];
      centerTree.innerText = trees[getRandomInt(0, trees.length)];
      centerTree.className += " old";
      if (tree.className=="tree") {
        tree.className = "old";
        treeIndex += 1;
      }
    }
    // if (treeSpans.length > 100) {
    //   treeSpans[0].remove();
    //   treeCenterIndex -= 1;
    // }
  }

  function removeGrass() {
    const grassSpans = Array.from(document.getElementsByClassName("grass"));
    if (grassSpans.length > 150) { 
      let grass = grassSpans[0];
      grass.className = "tree";
      grass.innerText = "";
      drawTree();
    }
  }

  function handleTouch(e, isMobile = false) {
    e.preventDefault();
    let [x, y] = (!isMobile) ? [e.pageX, e.pageY] : [e.targetTouches[0].pageX, e.targetTouches[0].pageY];
    drawGrass(x, y, true);
    let getX = (s=0,r) => x + r * Math.sin(s);
    let getY = (c=0,r) => y + r * Math.cos(c);
    let radius = 2;
    let s = 0; let c = 0;
    let interval = setInterval(() => {
      if (Math.random()>0.45) return; // skips sometimes
      // isTouching = true;
      // timer++;
      radius = getRandomInt(10, 50);
      drawGrass(getX(s+=1,radius), getY(c+=1,radius));
      // if (timer%5==0) 
      removeGrass();
    }, 15);
    (!isMobile) ? onmouseup = () => {clearInterval(interval);} : ontouchend = () => {clearInterval(interval);};
  }

  document.addEventListener('mousedown', handleTouch, {passive: false});
  document.addEventListener('touchstart', (e) => handleTouch(e, true), {passive: false});
  // document.addEventListener('mouseup', () => isTouching = false, {passive: false});
  // document.addEventListener('touchend', () => isTouching = false, {passive: false});
  // ontouchstart = (e) => handleTouch(e, true); // doesn't work if you want to get rid of auto text-select on safari (via e.preventDefault())
});