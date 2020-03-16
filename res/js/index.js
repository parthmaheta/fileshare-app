let form=document.getElementById('form')
let filesArray=[]
form.addEventListener('submit',submit)

let formdata=new FormData()

function submit(e){
    e.preventDefault()    
}

function getFile(e){
    let files=e.target.files 
    for(file of files)
     { 
         printFileName(file.name,filesArray.length)
         filesArray.push(file)
     }
    
}

function allowDrop(e){
 e.preventDefault()
}
function drop(e){
 e.preventDefault()
 let files=e.dataTransfer.files

 for(file of files)
 {
  printFileName(file.name,filesArray.length)
  filesArray.push(file)
 }

}
function printFileName(file,index){
    let fileNode=document.getElementById('file-container')

    let divNode=document.createElement('DIV')

    let node=document.createElement('SPAN')
    node.innerText=file

    let button=getButton(index)
        
    divNode.appendChild(node)
    divNode.appendChild(button)
    divNode.appendChild(document.createElement('BR'))

    fileNode.appendChild(divNode)    
    
}

function getButton(index){
    let button=document.createElement('BUTTON')
    button.innerText='X'    
    button.setAttribute('onclick','removeNode(event)')
    button.setAttribute('class','x-btn')
    button.setAttribute('data-index',index)
    return button
}

function removeNode(e){
    filesArray[e.target.dataset.index]=false
    e.currentTarget.parentNode.remove();
    console.log(filesArray)
}

function submitForm(){
    let count=0;
    for(let i=0;i<filesArray.length;i++)
      {
          if(filesArray[i])
           {   if(count>20)
                {alert('cant upload more than 20 files')
                 formdata=new FormData()
                 return
                }
               formdata.append('myFiles',filesArray[i])
               count++
           }
      }
    if(count>0)
    { fetch('/upload',{
        method:'post',
        body:formdata}
        )
        .then(data=>data.text().then(link=>{
            removeData()
           showlink(link)
        }))
         .catch(e=>console.log(e))

         
         showUploading();
    }
    else
        alert('no file')
    
}
function removeData(){
    filesArray=[]
    formdata=new FormData()
    let fileBox=document.getElementById('file-container')
    fileBox.style.opacity='1'
    fileBox.style.pointerEvents='auto'
    fileBox.innerHTML=''  
    document.getElementById('upload-msg').style.display='none'
 
}
function showUploading(){
    let fileBox=document.getElementById('file-container')

    document.getElementById('drag-msg').style.display='none'
    document.getElementById('upload-msg').style.display='block'
    document.getElementById('submit').style.display='none'
    document.getElementById('file').style.display='none'

    fileBox.style.opacity='0.6'
    fileBox.style.pointerEvents='none'
}
function showlink(link){
    
    document.getElementById('link-container').style.display='block'
    document.getElementById('link').href='./'+link
    document.getElementById('link').innerText=location.href+link
}

function copyUrl(e){
    
    var textArea = document.createElement("textarea")
    textArea.value = document.getElementById('link').innerText
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("Copy")
    textArea.remove()
    e.target.innerText='Copied'
}