var cmLise = document.querySelectorAll("td");

var btn_play = document.querySelector(".play");
var btn_moveback = document.querySelector(".moveback");
var btn_playagain = document.querySelector(".playagain");
//全局变量，颜色标记，用来转换棋子颜色
var rm = "b";
//记录最后一步，作用于悔棋
var lastmove;
//落子音效
var sound_move = document.querySelector(".sound_move");

var table = document.querySelector("table");

var right = 1;
var rightbottom = 16;
var bottom = 15;
var leftbottom = 14;

//定义棋盘左右的棋子边界。因为上下的棋子超出逻辑范围时同时也超出了数组边界，
//所以可以忽略上下边界的越界问题，而我需要将左右的棋子边界记录下来，以在后面的判断中协助判断
// var leftBorder = [0,15,30,45,60,75,90,105,120,135,150,165,180,195,210];
// var rightBorder = [14,29,44,59,74,89,104,119,134,149,164,179,194,209,224];
var border= [0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,14,29,44,59,74,89,104,119,134,149,164,179,194,209,224];
// for(let i = 0;i<15;i++){
//     for(let j = 0;j<15;j++){
//         document.write(i*15+j+"   ");
//     }
//     document.write("<br>")
// }

var left = -1;
var leftabove = -16;
var above = -15;
var rightabove = -14;

var body = document.body;

var curIndex = 0;

var boardOpacity = document.querySelector("progress");
// boardOpacity = 0.8;
var board = document.querySelector(".board");
// board.style.opacity = boardOpacity.value;
// boardOpacity = 0.8;






//切换背景
function changeBackImg() {
    var backImgs = ['../resources/image/backImg.jpg', 'static/resources/image/backImg2.jpg', '../resources/image/backImg3.jpg'];
    var backImg = '';
    var main = document.querySelector(".main");
    curIndex++;
    if (curIndex > 2) {
        curIndex = 0;
    }
    console.log(backImg[curIndex]);
    backImg = backImgs[curIndex];
    // main.setAttribute('background-image-url',backImg[curIndex]);
    switch (curIndex) {
        case 0:
            main.style.backgroundImage = 'url(../static/resources/image/backImg.jpg)';
            // background-image: url(../resources/image/backImg.jpg);
            break;
        case 1:
            main.style.backgroundImage = 'url(../static/resources/image/backImg2.jpg)';
            break;
        case 2:
            main.style.backgroundImage = 'url(../static/resources/image/backImg3.jpg)';
            break;
    }


}

function check(index, direc, count) {
    
    if(direc != above && direc != bottom){
        if(border.indexOf(index)>-1){
            return count;
        }
    }
    if (cmLise[index].className == cmLise[index + direc].className) {
        count++;
        return check(index + direc, direc, count);
    } else {
        count_n = 0;
        count_p = 0;
        return count;
    }
}
//悔棋功能键
function moveback(e) {
    //消除棋子，并改变下棋方

    cmLise[lastmove].className = "";
    if (rm == "b") {
        rm = "w";
        table.style.cursor = 'url(resources/image/cm_white.png),auto';
    } else {
        rm = "b";
        table.style.cursor = 'url(resources/image/cm_black.png),auto';
    }
    btn_moveback.disabled = "disable";
}
//开始游戏
function play() {
    //鼠标样式在开始游戏时为黑色棋子
    table.style.cursor = 'url(resources/image/cm_black.png),auto';
    //点击开始游戏后，禁用该键
    btn_play.disabled = "disable";

    //遍历棋盘上的每个位置
    cmLise.forEach(function (item, index) {
        item.onclick = function () {
            lastmove = index;
            if (item.className === "" && rm === "b") {
                move(item, index);
            } else if (item.className === "" && rm === "w") {
                move(item, index);
            }
        }
    })
}
//somebody win.
function sbwin() {
    //禁用“悔棋”
    btn_moveback.disabled = "disable";
    //将鼠标切换为默认样式
    table.style.cursor = 'auto';
    //无效化键盘事件
    cmLise.forEach(function (item, index) {
        item.onclick = function () {}
    })
    //添加延时器的目的，是为了使弹框在所有措施完成之后在出现。
    if (rm == "w") {
        setTimeout("alert('黑方胜')",100);
    } else {
        setTimeout("alert('白方胜')",100);
    }
}
//“再来一局”功能键
function playagain() {
    window.location.reload();
}
//落子
function move(item, index) {
    if (rm === "b") {
        item.className = "td_b";
        rm = "w";
    } else {
        item.className = "td_w";
        rm = "b";
    }
    //播放落子音效
    sound_move.load();
    sound_move.play();
    //恢复“悔棋”功能
    btn_moveback.disabled = false;
    //正方向计数
    var count_p = 0;
    //负方向计数
    var count_n = 0;
    if (rm == "b") {
        table.style.cursor = 'url(resources/image/cm_black.png),auto';
    } else {
        table.style.cursor = 'url(resources/image/cm_white.png),auto';
    }
    //检测棋子在上下、左右、左下到右上、右下到左上四个方向的同类名棋子数，如果够四个，则最后一手赢，游戏结束
    if ((check(index, right, count_p) + check(index, left, count_n) >= 4) ||
        (check(index, rightbottom, count_p) + check(index, leftabove, count_n) >= 4) ||
        (check(index, bottom, count_p) + check(index, above, count_n) >= 4) ||
        (check(index, leftbottom, count_p) + check(index, rightabove, count_n) >= 4)) {
        //一方已获胜，执行获胜后的行为
        sbwin();
    }
}

function addOpacity(){
    if(boardOpacity.value<1){
        boardOpacity.value +=0.1;
    }
    board.style.opacity = boardOpacity.value;
    
}
function subOpacity(){
    if(boardOpacity.value>0){
        boardOpacity.value-=0.1;
    }
    board.style.opacity = boardOpacity.value;
}


