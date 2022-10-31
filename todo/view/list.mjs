export default {
    //sets the element type - handy to avoid div soup!
    element: v => {
        return `div`
    },
    //set additional default values for this view
    values: v => {
        return {
        }
    },
    //enter any css here. ${v.selector} is a class selector that is unique to this element
    style: v => {
        return `
        ${v.selector} {
            
        }
        `
    },
    //the default HTML view to show
    view: v => {
        return `
        <button class="add">+</button>
        <button class="export">export</button>
        <ul></ul>
        `
    },
    //script which runs when the element is added to the page from the `a.render` method
    script: v => {
        v.find('button.add').addEventListener('click', () => {
            a.append(v.find('ul'), a.v('list-item'))
        })
        v.find('button.export').addEventListener('click', () => {
            let results = Object.values(v.findAll('li')).map(item => item.this.output())
            console.log(results)
        })
    }
}