
// Allow multiple draggable items
let dragSources = document.querySelectorAll('[draggable="true"]')
dragSources.forEach(dragSource => {
    dragSource.addEventListener('dragstart', dragStart)
    dragSource.addEventListener('dragend', dragEnd)

})

function dragStart (e) {
    this.classList.add('dragging')
    e.dataTransfer.setData('text/plain', e.target.id)
}
function dragEnd (e) {
    this.classList.remove('dragging')
}

// Allow multiple dropped targets
let dropTargets = document.querySelectorAll('[data-role="drag-drop-container"]')
dropTargets.forEach(dropTarget => {
dropTarget.addEventListener('drop', dropped)
dropTarget.addEventListener('dragenter', cancelDefault)
dropTarget.addEventListener('dragover', cancelDefault)
})

function dropped (e) {
    let id = e.dataTransfer.getData('text/plain')
    e.target.appendChild(document.querySelector('#' + id))
    this.classList.remove('hover')
}
function dragOver (e) {
    this.classList.add('hover')
}

function dragLeave (e) {
    this.classList.remove('hover')
}
function cancelDefault (e) {
    e.preventDefault()
    e.stopPropagation()
    return false
}
