let down=document.querySelector('.down');
let up=document.querySelector('.up');
let bigCon=document.querySelector('.big-cont');
let popup=document.querySelector('.popup')
let newNum=0;
const wy={
    currentNum:0,
    moveTargetId: 0,
    partl:{length:0},
    checkAllBox:document.querySelector('.checkAll'),
    checkAllImg:document.querySelector('.checkAll img'),
    checkAllNum:document.querySelector('.div'),
    fsItems:document.querySelector('.down').children,
    onOff:false,

    nameBtn:document.querySelector('.a2').parentNode,
    rmBtn:document.querySelector('.a3').parentNode,
    omit:document.querySelector('.omit'),
    alertInfo:document.querySelector('.newsName'),
    newBtn:document.querySelector('.a4').parentNode,
    moveBtn:document.querySelector('.a1').parentNode,
}
console.log(wy.rmBtn)
//初始化
init(wy.currentNum);
function init(currentNum){
    downHTml(list,currentNum);
    upHTML(list,currentNum);
    
}


//生成一个文件夹节点
function creatHTML(data){
    let newFlie=document.createElement('div');
    newFlie.className='item';
    newFlie.innerHTML=`
                        <div class="checkbox"></div>
                        <div class="item-img"></div>
                        <div class="item-name">${data.name}</div>
                        <input type="text" value="${data.name}">
                    `;
    let additems=newFlie.querySelectorAll('div');
    for(var i=0;i<additems.length;i++){
        additems[i].fileId=data.id
    }
    return newFlie
};
//生成面包屑节点
function upCreat(data){
    var li=document.createElement('li');
    var span=document.createElement('span');
    span.fileId=data.id;
    span.innerHTML=data.name;
    li.appendChild(span);
    return  li
}
//生成文件夹
function downHTml(list,id){
    down.innerHTML='';
    let child=getChildrenById(list,id);     //找到id所对应的子目录       
    child.forEach(function(item,i){
        down.appendChild(creatHTML(item));      //有几个item就给down里添加几个
    });
};


//生成面包屑结构
function upHTML(list,id){
    up.innerHTML='';
    var data=getAllParent(list,id);
    data.forEach(function(item,i){
        up.appendChild(upCreat(item))
    })
}
//面包屑点击事件
up.addEventListener('click',function(e){
    var target=e.target;
    //点击的那个id不是undefined并且num不等于点击的那个id
    if(target.fileId!=='undefined' && wy.currentNum!==target.fileId){
        //重新刷新页面内容
        init(wy.currentNum=target.fileId);
        //初始化全选按钮
        initChecked(false);
        itemKong();
    }
});

//文件夹点击事件
down.addEventListener('click',function(e){
    e.stopPropagation();
    var target=e.target;
    const {currentNum,partl}=wy;
    //点击文件夹图片进入文件夹
    if(target.classList.contains('item-img')){  
        init(wy.currentNum=target.fileId);
        initChecked(false);
        wy.checkAllImg.classList.remove('active');
        itemKong();
    }
    //点击选中复选框
    if(target.classList.contains('checkbox')){  
        checkNodeData(target.parentNode)
        }
    //点击重命名
    if(target.classList.contains('item-name')){
        
        if(partl.length===1){
            //判断点击的是不是所选中的那个文件夹
            const {partl}=wy;
            const len=partl.length;
            if(len>1){
                alert('只能选择一个文件夹');
                return
            }
            if(!len){
                alert('没有选择文件夹');
                return
            }
            setItemname(partl);
        }
    }
})
//单选  全选功能
function checkNodeData(checkNode){
    const {fileId}=checkNode.firstElementChild;     //因为每个文件夹没有id；
    const checked=checkNode.classList.toggle('active');
    const {partl,checkAllImg,checkAllNum,fsItems}=wy;
    const len=fsItems.length;
    if(checked){
        partl[fileId]=checkNode;
        partl.length++;
    }else{
        delete partl[fileId];
        partl.length--;
    }
    const checkedLen=partl.length;
    checkAllNum.innerHTML=`已选中${checkedLen}个文件`;
    checkAllImg.classList.toggle('active',checkedLen===len);
}
//全选功能
wy.checkAllBox.addEventListener('click',function(){
    console.log(1);
    const {checkAllImg}=wy;
    const isChecked=checkAllImg.classList.toggle('active');   //全选按钮点击和取消状态
    toggleCheckAll(isChecked);
})
//初始化全选功能
function initChecked(){
    if(wy.partl.length>0){
        wy.checkAllImg.classList.remove('active');
    }
    toggleCheckAll(false)
}
function toggleCheckAll(isChecked){
    const {partl,checkAllNum,fsItems}=wy;
    const len=fsItems.length;
    if(isChecked){
        partl.length=len;
        checkAllNum.innerHTML=`已选中${partl.length}个文件`;
    }else{
        wy.partl={length:0};
        checkAllNum.innerHTML=`全选`;
    }
    for(var i=0;i<len;i++){
        const fildeItem=fsItems[i].firstElementChild;
        const {fileId}=fildeItem;
        fildeItem.parentNode.classList.toggle('active',isChecked);
        if(!partl[fileId] && isChecked){    //!partl[fileId] 之前点击选中的不需要在添加进来
            partl[fileId]=fildeItem.parentNode;

        }
    }
}


//文件夹为空的提示信息
let mesKong=document.querySelector('.down-kong');
function itemKong(){
    const {fsItems}=wy;
     if(!fsItems.length){
        mesKong.style.display='block';
    }else{
        mesKong.style.display='none';
    }
}

//重命名
wy.nameBtn.addEventListener('click',newNameItem)
function newNameItem(e){
    
    const {partl}=wy;
    const len=partl.length;
    if(len>1){
        alertMessage('只能选择一个文件夹');
        return
    }
    if(!len){
        alertMessage('没有选择文件夹');
        return
    }
    setItemname(partl);
}    
function setItemname(partl,scuFn,failFn){
    
    const checkedEle=getCheckeditem(partl)[0]; // 因为partl里面就有一个对象 所以data当中就一个数据
    const {currentNum,fileId,fileNode}=checkedEle;     //结构赋值
    const nameText=fileNode.querySelector('.item-name');
    const nameInp=fileNode.querySelector('input');
    dblSetCls(nameInp,nameText);
    const oldName=nameInp.value=nameText.innerHTML;
    nameInp.select();
    //文本失焦事件
    nameInp.onblur=function(){
        
        let newName=this.value.trim();
        if(!newName){
            dblSetCls(nameText,nameInp);
            this.onblur=null;
            failFn&&failFn();
            return
        }
        if(newName===oldName){
            dblSetCls(nameText,nameInp);
            this.onblur=null;
            return
        }
        if(!nameCanUse(list,wy.currentNum,newName)){    //一定是wy.currentNum
            this.select();
            return alertMessage('命名冲突')
           
        }
        nameText.innerHTML=newName;
        dblSetCls(nameText,nameInp);
        console.log(partl)
        setItemById(list,fileId,{name:newName})  //修改对应的数据
        scuFn&&scuFn(newName);
        console.log(1)
        this.onblur=null;
    };
    window.onkeyup=function(e){
        if(e.keyCode===13){
            nameInp.blur();     //失焦事件
             // this.onkeyup=null;  //清除键盘事件
        }
    }
}

function dblSetCls(show,hidden){
    show.style.display='block';
    hidden.style.display='none';
}

//将选中的元素缓存转换成数组
function getCheckeditem(partl){
    var data=[];
    for(let key in partl){
        if(key !=='length'){    //key不等于partl中的length       之前声明的partl{length：0}
            const currentItem=partl[key];
            data.push({
                fileId:parseFloat(key),
                fileNode:currentItem
            });
        }
    }
    
    return data
}

//提示信息
function alertMessage(text){
    clearTimeout(alertMessage.timer)
    let {alertInfo}=wy;
    alertInfo.firstElementChild.innerHTML=text;
    alertInfo.parentNode.style.display='block';
    animation({
        el:alertInfo,
        attrs:{
            top:280,
        },
        cb(){
            shake({
                el:alertInfo,
                times:40,
                cb(){
                    alertMessage.timer=setTimeout(function() {
                        alertInfo.parentNode.style.display='';
                        alertInfo.style.top='';
                    }, 1000);

                }
            })
        }
    })
}
//删除文件夹 
wy.rmBtn.onclick=rmItems;

function rmItems(e){
    let sureBtn=document.querySelector('.omit-down').firstElementChild;
    let falseBtn=document.querySelector('.omit-down').lastElementChild;
    let endBtn=document.querySelector('.omit-top').lastElementChild;
    const {partl,omit}=wy;
    const len=partl.length;
    
    if(len){
        omit.parentNode.style.display='block';
        animation({
            el:omit,
            attrs:{
                top:200
            }
        })
        sureBtn.onclick=function(){
            let arr=getCheckeditem(wy.partl)
            arr.forEach(function(item){
                var arrId=item.fileId;
                var arrNode=item.fileNode;
                //删除对应的文件
                down.removeChild(arrNode);
                wy.partl={length:0};
                //删除parlt对应的数据
                delete wy.partl[arrId];
                //删除指定id以及所有的子集
                deleteAllChildren(list,arrId);
                var items=down.querySelectorAll('.item');
                itemKong();
                initChecked();
                // 重新判断是否全选
                if(items.length===0){
                    wy.checkAllImg.classList.remove('active')
                }
                wy.checkAllNum.innerHTML=`已选中${wy.partl.length}个文件`;
            })
            omitMove()
        }
        falseBtn.onclick=endBtn.onclick=function(){
            omitMove()
        }
    }else{
        alertMessage('未选择文件夹')
    }
    function omitMove(){
        omit.parentNode.style.display='';
        animation({
            el:omit,
            attrs:{
                top:-200
            }
        })
    }
}
// 新建文件夹
wy.newBtn.onclick=newItem;
function newItem(){
    initChecked();
    const {currentNum,partl}=wy;
    let folderData={
        id:Date.now(),
        name:'',
        pId:currentNum,
    }
    const newFolderData=creatHTML(folderData);
    //添加新生成的节点
    down.insertBefore(newFolderData,down.firstElementChild);
    //选中新生成的节点
    checkNodeData(newFolderData);
    itemKong();
    //重命名函数
    setItemname(wy.partl,
        (name)=>{
            folderData.name=name;
            addOneData(list,folderData);
            itemKong();
        },
        ()=>{
            down.removeChild(newFolderData);
            itemKong();
            initChecked();
            alertMessage('取消新建')
        }
    );
}
//生成移动弹框的结构
function bigConHTML(list,id=0,currentListId){
    bigCon.innerHTML='';
    const data=list[id];
    //获取包括他自己的所有父级的数组的长度
    const floorIndex=getAllParent(list,id).length;
    //获取当前id的所有子集
    const children=getChildrenById(list,id);
    const len=children.length;
    var str=`<ul>`;
    str+=`<li>
            <div data-file-id="${data.id}" class="${currentListId==data.id ? 'active' : ''}" style="padding-left:${(floorIndex-1)*14}px">
            <i data-file-id="${data.id}" class="glyphicon glyphicon-folder-close icon"></i>
            <span data-file-id="${data.id}" class="name">${data.name}</span>
            </div>`;
    if(len){
        for(var i=0;i<len;i++){
           str+= bigConHTML(list,children[i].id,currentListId)
        }
    }
    str+=`</li></ul>`
    return  bigCon.innerHTML=str;
}
//移动文件夹
wy.moveBtn.addEventListener('click',moveItems)
function moveItems(e){
    const {partl}=wy;
    const len=partl.length;
    if(!len){
       return alertMessage('未选中文件夹')
    }
    setMoveDalog(sureFn,cancleFn)
    function sureFn(){
        //将partl转换成数组
        const checkedEles=getCheckeditem(partl);
        let canMove = true;
        for(let i=0;i<checkedEles.length;i++){
            const {fileId,fileNode}=checkedEles[i];
            //判断是否能移动数据
            const ret=canMoveData(list,fileId,wy.moveTargetId);
            
            if(ret===2){
                canMove=false;
                return alertMessage('已在当前目录')
            }
            if(ret===3){
                canMove=false;
                return alertMessage('不能移动到自己的子集');
            }
            if(ret===4){
                canMove=false;
                return alertMessage('命名冲突');
            }
        }
        
        if(canMove){
            checkedEles.forEach(function(item){
                const {fileId,fileNode}=item;
                moveDataToTarget(list,fileId,wy.moveTargetId); 
                down.removeChild(fileNode)
                popup.style.display='';
                bigCon.parentNode.style.top='';
            })
            itemKong();
            initChecked();
        }
    };
    //取消移动事件
    function cancleFn(){
        popup.style.display='';
        bigCon.parentNode.style.top='';
      }
}
function setMoveDalog(sureFn,cancleFn){
    //生成的移动框内容结构
    bigConHTML(list,0,wy.currentNum);
    
    popup.style.display='block';
    bigCon.parentNode.style.top='150px';
    dragEle({
        downEle: popup.querySelector('.big-top'),   //点击的元素
        moveEle: popup.querySelector('.big'),     //移动的元素
      });
    console.log(popup.querySelector('.big'))
    const listTreeItems=popup.querySelectorAll('.big-cont div');
    //储存前一个id
    let prevActive=wy.currentNum;
    let len=listTreeItems.length;
    
    for(let i=0;i<len;i++){
        listTreeItems[i].onclick=function(){
            //清除前一个的样式
            listTreeItems[prevActive].classList.remove('active');
            //给当前添加样式
            this.classList.add('active');
            //让prevActive（前一个）变成当前这个的id
            prevActive=i;
            wy.moveTargetId = this.dataset.fileId * 1;  //dataset获取自定义属性的集合  获取过来的是一个对象
        }
        //点击每个文件夹小图标
        listTreeItems[i].firstElementChild.onclick=function(){
            //截取不包括自己的子集集合
            const allSbings=[...this.parentNode.parentNode.children].slice(1);
            //添加显示隐藏事件
            if(allSbings.length){
                allSbings.forEach(function(item){
                    item.style.display=item.style.display==='' ? 'none' : '';
                })
            }
            //改变文件夹图标样式
            this.classList.toggle('iconClose');
        }
    }
    const sureBtn=document.querySelector('.big-down').firstElementChild;
    const cancleBtn=document.querySelector('.big-down').lastElementChild;
    const closeBtn=document.querySelector('.big-top em');
    cancleBtn.onclick=closeBtn.onclick=function(){
        cancleFn&&cancleFn()
    }
    sureBtn.onclick=function(){
        sureFn&&sureFn();
    }
    //阻止事件冒泡
    closeBtn.onmousedown = function (e){
        e.stopPropagation();
      };
}


//鼠标画框选中
document.onmousedown=function(e){
    // e.preventDefault();
    const {fsItems,partl,checkAllNum,checkAllImg}=wy;
    wy.partl={length:0};
    
    const target=e.target;
    if(target.classList.contains('item-img')){
        return;
    }
    let div=document.createElement('div');
    div.className='kuang';
    document.body.appendChild(div);
    let startX=e.pageX;
    let startY=e.pageY;
    document.onmousemove=function(e){
        e.preventDefault();
        wy.checkAllImg.classList.remove('active');
        let x=e.pageX;
        let y=e.pageY;
        div.style.left=Math.min(x,startX)+'px';
        div.style.top=Math.min(y,startY)+'px';
        div.style.width=Math.abs(x-startX)+'px';
        div.style.height=Math.abs(y-startY)+'px';
        for(let i=0;i<fsItems.length;i++){
            if(duang(div,fsItems[i])){
                fsItems[i].classList.add('active');
            }else{
                fsItems[i].classList.remove('active')
            }
        }
    }
    document.onmouseup=function(){
        document.body.removeChild(div);
        console.log(1);
        document.onmousemove=document.onmouseup=null;
        for(let i=0;i<fsItems.length;i++){
            field=fsItems[i].firstElementChild.fileId
            if(fsItems[i].classList.contains('active')){
                wy.partl[field]=fsItems[i];
                wy.partl.length++;
            }
        }
        wy.checkAllNum.innerHTML=`已选中${wy.partl.length}个文件`;
        wy.checkAllImg.classList.toggle('active',wy.partl.length===fsItems.length);
        
        
    }
}
var menu=document.querySelector('.menu');
var spans=document.querySelectorAll('.menu span')
down.oncontextmenu=function(e){

    e.preventDefault();
    console.log(spans);
    menu.style.display='flex';
    var x=e.pageX,y=e.pageY;
    if(window.innerWidth-x<menu.offsetWidth){
        x=window.innerWidth-menu.offsetWidth
    }
    if(window.innerHeight-y<menu.offsetHeight){
        y=window.innerHeight-menu.offsetHeight
    }
    menu.style.left=x+'px';
    menu.style.top=y+'px';
    
}

down.onclick=function(){
    // this.onmouseup=null;
    menu.style.display='';
}
spans[0].onclick=function(){
    console.log(1)
    menu.style.display='';
    newNameItem();
    
};
spans[1].onclick=function(){
    menu.style.display='';
    init(wy.currentNum);
    initChecked()
    wy.checkAllNum.innerHTML=`全选`;
}
spans[2].onclick=function(){
    menu.style.display='';
    moveItems();
    
}
spans[3].onclick=function(){
    menu.style.display='';
    rmItems();
    
}
spans[4].onclick=function(){
    menu.style.display='';
    newItem();
    
}
