interface IPhotos {
    id :number
    albumId:number
    url:string
}

interface Album{
    name:string
    id:number
}

class Photos{
    async ShowPhotos(id:number){
         const response = await fetch("http://localhost:3000/photos")
         const photos = await response.json() as IPhotos[]
         let filtered :IPhotos[]= [];
        if(id===1){
              filtered=photos
        }else{
            filtered= photos.filter(photo=>{
            return photo.albumId===id
            })  

            console.log(filtered);
            
        }
        if(filtered.length){
            let html=''
        filtered.forEach(photo=>{
        html+= `
        <div class="item">
        <img src=${photo.url} alt="">
        <button onClick="Photos.updatePhoto(${photo.id})">Add to Album</button>
    </div>
        
        `
        }
        )
        const app = document.querySelector('#app')! as HTMLDivElement
        app.innerHTML = html
       
        }  else{
            const app = document.querySelector('#app')! as HTMLDivElement 
            app.innerHTML= '<p> No Photos Found</p>'
        }
  
    }



        

    static async addPhoto(url:string){
        // const newPhoto= Photos.readValue()
        // console.log(newPhoto);
        const newPhoto={url, albumId:1}
        await fetch('http://localhost:3000/photos', {
            method:"POST",
            body:JSON.stringify(newPhoto),
            headers:{
                "Content-Type": "application/json"
            }
        })
    }
    

    static async  updatePhoto(id:number){
      
        const response = await fetch(`http://localhost:3000/photos/${id}`)
        const photo = await response.json() as IPhotos
        Photos.prepopulate(photo)
        btn.addEventListener('click', async ()=>{
            if(btn.textContent==='Update Photo'){
                let albumId=(document.querySelector('#albums1') as HTMLSelectElement).value
              await Photos.sendUpdate(+albumId, photo.id)
            }
      })

        document.querySelector('#albums') as HTMLSelectElement 
    }
    
    static async sendUpdate(albumId:number ,photoid:number){
        console.log(albumId,photoid);
        
        await fetch(`http://localhost:3000/photos/${photoid}`, {
            method:"PATCH",
            body:JSON.stringify({albumId}),
            headers:{
                "Content-Type": "application/json"
            }
        })
    }
    static prepopulate(photo:IPhotos){
      (document.querySelector('#albums') as HTMLSelectElement).value=photo.albumId.toString();
      (document.querySelector('#image') as HTMLInputElement).value=photo.url;
      (document.getElementById("addBtn")! as HTMLButtonElement).innerText="Update Photo"
    }
 
    /// Previous Method
    static readValue(){
        const url = (document.querySelector('#image') as HTMLInputElement).value
        return { url , albumId:1}
    }

}

new Photos().ShowPhotos(1)

const btn = document.getElementById("addBtn")! as HTMLButtonElement

btn.addEventListener('click', async ()=>{
      if(btn.textContent==='Add photos'){
        // await Photos.addPhoto()
      }
})

//cloudinary Code Here
const imageInput = document.querySelector('#image') as HTMLInputElement
imageInput.addEventListener('change', async (e:Event)=>{
const target = e.target as HTMLInputElement
const btn = document.getElementById("addBtn")! as HTMLButtonElement
btn.textContent="Loading..."
console.log(target);

const files=target.files as FileList;


if(files){
  const formData = new FormData();
  formData.append("file", files[0]); // the file
  formData.append("upload_preset", "testing");// preset folder
  formData.append("cloud_name", "joendambuki16");//username  

let promise = new Promise<{url:string}>((resolve, reject)=>{
   fetch("https://api.cloudinary.com/v1_1/joendambuki16/image/upload",{
        method:"POST",
        body:formData
      }).then(res=>{
        return res.json()
      } 
      ).then(url=>{
        resolve(url)
      }).catch(error=>{
        reject(error)
      })
})

promise.then(data=>{
    if(data.url){
        btn.textContent="Add Photos"
        console.log("Yes");
        
        Photos.addPhoto(data.url)
    }
    
}).catch(error=>{
    console.log(error);
    
})
}
})


const albumsContainer = document.querySelector('#albums') as HTMLSelectElement

albumsContainer.addEventListener('change', ()=>{  
    new Photos().ShowPhotos(+albumsContainer.value) 
    console.log(+albumsContainer.value);
    
})

class Albums{

    static async showAlbums(){
        const response = await fetch("http://localhost:3000/albums")
        const albums = await response.json() as Album[]

        const albumsContainer = document.querySelector('#albums') as HTMLSelectElement
        const albumsContainer1 = document.querySelector('#albums1') as HTMLSelectElement
            let html =''
            for(let album of albums){
                html+=`<option value=${album.id}>${album.name}</option>`
            }

            albumsContainer.innerHTML=html
            albumsContainer1.innerHTML=html

    }
}

Albums.showAlbums()