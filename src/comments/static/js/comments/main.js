// import { createComment, updateCommentLikes } from "./comment.js"

// const csrftoken = document.querySelector("input[name=csrfmiddlewaretoken]").value


// // comment form validation listening
// const comment_form = document.querySelector("#comment_form")
// comment_form.addEventListener("submit", (e) => {
//     e.preventDefault()

    
//     const comment = {
//         content: comment_form.querySelector("textarea").value
//     }
    
//     // create and add comment in DOM
//     createComment(comment, csrftoken)

//     // like buttons
//     setTimeout(() => {
//         listenToLikeBtns()
//     }, 2000)

//     // reset input
//     comment_form.querySelector("textarea").value = ""
// })


// // like 
// const listenToLikeBtns = () => {
    
//     const like_btns = document.querySelectorAll(".like-btn")

//     like_btns.forEach((like_btn) => {
//         like_btn.addEventListener("click", (e) => {
//             e.preventDefault()
//             const comment = e.target.closest(".comment")
    
//             updateCommentLikes(comment)
//             comment.querySelector(".like-btn").classList.toggle("liked")
    
//         })
//     })
// }; listenToLikeBtns()



// // listen to reply form
// const listenToReplyForm = (responseForm, parentComment) => {
//     // 5. add event listener to the reply submit button
//     responseForm.querySelector("input[type=submit]").addEventListener("click", (e) => {
//         e.preventDefault()
//         parentComment.classList.add("isparent")

//         // 6. get the response content, csrf token, and parent comment id
//         const response_content = responseForm.querySelector("textarea").value 
//         const csrftoken = responseForm.querySelector("input[name=csrfmiddlewaretoken]").value
//         const parent_comment_id = parentComment.dataset.id

//         // 7. create a response comment object
//         const response_comment = {
//             content: response_content,
//             parent_id: parent_comment_id,
//         }

//         // 8. create and add the response comment in DOM
//         createComment(response_comment, csrftoken)

//         setTimeout(() => {
//             updateCommmentWidth()
//         }, 2000)

//         // like btns
//         listenToLikeBtns()
//     })
// }


// // Reply activity
// const callReplyActivity = (e) => {
//     // 1. get the parent comment
//     const comment = e.target.closest(".comment")

//     // 4. add the cloned template to the parent comment
//     comment.appendChild(document.querySelector("#response-form-template").content.cloneNode(true))

//     // 2. get the response form 
//     const responseForm = comment.querySelector("#response-form")

//     // reply form listening 
//     listenToReplyForm(responseForm, comment)
// }


// // listen to replies buttons 
// const listenToReplyBtns = () => {
//     const reply_btns = document.querySelectorAll(".response-btn")
//     reply_btns.forEach((reply_btn) => {
//         reply_btn.addEventListener("click", (e) => {
//             e.preventDefault()

//             callReplyActivity(e)
//         })
//     })
// }; listenToReplyBtns();


// function getParent(child){
//     let previousElement = child.previousElementSibling;

//     while (previousElement) {
//         if (previousElement.matches('#all-comments')) {
//             return null;
//         }

//         if (previousElement.matches('.isparent')) {
//             return previousElement;
//         }
//         previousElement = previousElement.previousElementSibling;
//     }
//     return null;
// }


// // child width
// function updateCommmentWidth(){
//     const children = document.querySelectorAll(".ischild")
//     children.forEach((child) => {
//         const parent = getParent(child)
//         if (parent) {
//             child.style.width = `${parent.clientWidth - 50}px`
//         }
//     })
// }; updateCommmentWidth()

