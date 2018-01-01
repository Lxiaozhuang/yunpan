let  list={
    '0':{
        id:0,
        name:'全部文件',
    },
    '1':{
        id:1,
        pId:0,
        name:'小电影',
    },
    '2':{
        id:2,
        pId:0,
        name:'音乐',
    },
    '3':{
        id:3,
        pId:1,
        name:'魁拔'
    },
    '4':{
        id:4,
        pId:2,
        name:'流行音乐'
    },
    '5':{
        id:5,
        pId:2,
        name:'古典音乐'
    },
    '6':{
        id:6,
        pId:1,
        name:'战狼1'
    },
    '7':{
        id:7,
        pId:1,
        name:'战狼2'
    },
    '8':{
        id:8,
        pId:4,
        name:'周杰伦'
    },
};


//获取指定id以及有父级
function getAllParent(list,id){
    let arr=[];
    const current=list[id];
    if(current){
        arr.push(current);
        arr=getAllParent(list,current.pId).concat(arr);
    }
    return arr
}


//根据指定id删除对应的子目录
function deleteAllChildren(list,id){
    if(!id) return false;
    delete(list[id]);
    let children=getChildrenById(list,id);
    let len=children.length;
    if(len){
        for(let i=0;i<len;i++){
            deleteAllChildren(list,children[i].id)
        }
    }
    return true
}



//找到id对应的子目录
function getChildrenById(list,id){
    let arr=[];
    //for。。in循环找到list[key]
    for(let key in list){
        const item=list[key]
        if(list[key].pId===id){
            arr.push(item)
        }
    }
    return arr
}

//找到指定id
function getById(list,id){
    return list[id]
}

// 判断名字是否可用
function nameCanUse(list,id,text){
    const currentData=getChildrenById(list,id);     //找到所对应的子集
    return currentData.every(item => item.name !==text)
}
//根据id 找到对应的数据
function setItemById(list,id,data){         
      
    const item = list[id];
    return item && Object.assign(item, data);   // 合拼对象里面的属性
}
//新建一条数据
function addOneData(list,data){
    return list[data.id] = data;
}
//判断可否移动数据
function canMoveData(list,currentId,targetId){  //currentId要一定的文件夹； targetId目标点
    const currentData = list[currentId];    
    const targetParents = getAllParent(list,targetId);
    if(currentData.pId === targetId){
        return 2    //自己所在原本文件夹
    }
    if(targetParents.indexOf(currentData) !== -1){    //indexOf(),找到currentData就返回找到的索引值；没有找到返回-1；
        return 3    //不能移动到自己的子集
    }
    console.log(currentId)
    if(!nameCanUse(list,targetId,currentData.name)){    //查看目标点的名字
        return 4    //命名冲突
    }   
    return 1
}
function moveDataToTarget(list, currentId, targetId){
    list[currentId].pId = targetId;     //将移动的文件夹的pId变成目标点的id
  }