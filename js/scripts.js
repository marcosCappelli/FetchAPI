const url = "https://jsonplaceholder.typicode.com/posts"

const loadingElement = document.querySelector("#loading")
const postsContainer = document.querySelector("#posts-container")

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsConatiner = document.querySelector("#comments-container");

//GET id from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

// Get all posts
async function getAllPosts() {
    const response = await fetch(url);

    console.log(response);

    const data = await response .json();

    console.log(data);

    loadingElement.classList.add("hide");

    data.map((post) => {
        const div = document.createElement("div");
        const title = document.createElement("h2");
        const body = document.createElement("p");
        const link = document.createElement("a");

        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = "Ler";
        link.setAttribute("href", `/post.html?id=${post.id}`);

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postsContainer.appendChild(div);
    });

}

//GET individual post
async function getPost(id) {
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`),
    ]);  // Assim será executado as duas request ao mesmo tempo

    //Extrair os dados agora
    const dataPost = await responsePost.json();

    const dataComments = await responseComments.json();  
    //Assim teremos dois arreis de objetos

    //Agora tirar looding
    loadingElement.classList.add("hide");
    //Aparecer comentários
    postPage.classList.remove("hide");

}

if (!postId) {
    getAllPosts();
} else {
    getPost(postId);
}