
const url = "https://jsonplaceholder.typicode.com/posts";
//Select element #
const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

//GET id from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

// Get all posts
async function getAllPosts() {
    const response = await fetch(url);

    console.log(response);

    const data = await response.json();

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

    //Buscar textos
    const title = document.createElement("h1");
    const body = document.createElement("p");

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    // Fazer commentários
    dataComments.map((comment) => {
        createComment(comment);
    });

}

function createComment(comment) {
    //Elementos
    const div = document.createElement("div");
    const email = document.createElement("h3");
    const commentBody = document.createElement("p");
     //Monta div com os comnetários
    //Prencher textos
    email.innerText = comment.email;
    commentBody.innerText = comment.body;
    //Inserir dados na API
    div.appendChild(email);
    div.appendChild(commentBody);

    commentsContainer.appendChild(div); 
    //Insere div de comentários
}

// Post a comment
async function postComment(comment) {
    //POST, PUT, PATCH, DELETE - headers, body
    const response = await fetch(url, {
        method: "POST",
        body: comment,
        headers: {
            "Content-type": "application/json",
        },
    });

    const data = await response.json();

    createComment(data);

}

if (!postId) {
    getAllPosts();
} else {
    getPost(postId);

    //Add event to comment form
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let comment = {
            email: emailInput.value,
            body: bodyInput.value,
        };

       comment = JSON.stringify(comment);
        //Função assíncrona responsável por inserir comentário
       postComment(comment);
    });
}
