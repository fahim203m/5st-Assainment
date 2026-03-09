const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let issues = [];

const container = document.getElementById("issuesContainer");
const spinner = document.getElementById("spinner");

async function loadIssues(){

spinner.classList.remove("hidden");

const res = await fetch(API);
const data = await res.json();

issues = data.data;

document.getElementById("issueCount").innerText = issues.length;

displayIssues(issues);

spinner.classList.add("hidden");

}


function getPriorityColor(priority){

if(priority === "HIGH")
return "bg-red-100 text-red-600";

if(priority === "MEDIUM")
return "bg-yellow-100 text-yellow-700";

if(priority === "LOW")
return "bg-gray-200 text-gray-600";

return "bg-gray-100";

}


function displayIssues(list){

container.innerHTML = "";

list.forEach(issue => {

const card = document.createElement("div");

card.className =
"bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border";


if(issue.status === "open"){
card.style.borderTop = "4px solid #22C55E";
}else{
card.style.borderTop = "4px solid #8B5CF6";
}


let statusIcon="";

if(issue.status==="open"){
statusIcon=`<div class="w-6 h-6 border-2 border-dashed border-green-500 rounded-full"></div>`;
}else{
statusIcon=`<div class="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs">✓</div>`;
}


card.innerHTML=`

<div class="flex justify-between items-start mb-2">

${statusIcon}

<span class="text-[10px] px-3 py-[3px] rounded-full ${getPriorityColor(issue.priority)}">
${issue.priority}
</span>

</div>

<h3 class="font-semibold text-sm mb-1">
${issue.title}
</h3>

<p class="text-xs text-gray-500 line-clamp-2">
${issue.description}
</p>

<div class="flex flex-wrap gap-1 mt-2 text-[10px]">

<span class="bg-red-100 text-red-600 px-2 py-[2px] rounded-full">
BUG
</span>

<span class="bg-yellow-100 text-yellow-700 px-2 py-[2px] rounded-full">
HELP WANTED
</span>

</div>

<div class="text-[10px] text-gray-400 mt-3">
#${issue.id} by ${issue.author}
</div>

<div class="text-[10px] text-gray-400">
${issue.createdAt}
</div>

`;

card.onclick=()=>openModal(issue.id);

container.appendChild(card);

});

}


function changeTab(status,btn){

document.querySelectorAll(".tabBtn")
.forEach(b=>{
b.classList.remove("bg-purple-600","text-white");
});

btn.classList.add("bg-purple-600","text-white");

if(status==="all"){
displayIssues(issues);
return;
}

const filtered=issues.filter(i=>i.status===status);

displayIssues(filtered);

}


async function openModal(id){

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
);

const data = await res.json();

const issue = data.data;

const modal=document.getElementById("modal");

modal.classList.remove("hidden");
modal.classList.add("flex");

document.getElementById("modalTitle").innerText=issue.title;
document.getElementById("modalDesc").innerText=issue.description;
document.getElementById("modalAuthor").innerText="Author: "+issue.author;

}


function closeModal(){

document.getElementById("modal").classList.add("hidden");

}


async function searchIssues(){

const text=document.getElementById("searchInput").value;

spinner.classList.remove("hidden");

const res=await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
);

const data=await res.json();

displayIssues(data.data);

spinner.classList.add("hidden");

}


loadIssues();