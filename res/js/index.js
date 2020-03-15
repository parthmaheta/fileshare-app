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
    let fileNode=document.getElementById('filename')

    let divNode=document.createElement('DIV')

    let node=document.createElement('SPAN')
    node.setAttribute('data-index',index)
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
    for(let i=0;i<filesArray.length;i++)
      {
          if(filesArray[i])
           formdata.append('myFiles',filesArray[i])
      }

    fetch('http://localhost:8080/upload',{
        method:'post',
        body:formdata}
        )
        .then(data=>data.text().then(m=>console.log(m)))
         .catch(e=>console.log(e))

}