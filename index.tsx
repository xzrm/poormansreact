let React = {
    createElement: (tag, props, ...children) => {
        if (typeof tag == "function") {
            return tag(props)
        }
        const element = {tag, props: {props, children}}
        console.log(element)
        return element
    }
}
const App = () => {
    return (
        <div className="test class name">
            <h1 className="test h1">Hello, person</h1>
            <input type="text" placeholder="name"/>
            <p>lorem ipsum </p>
        </div>
    )
}

const render = (reactElementOrStringOrNumber, container) => {
    if(['string','number'].includes(typeof reactElementOrStringOrNumber)){
        container.appendChild(document.createTextNode(String(reactElementOrStringOrNumber)));
        return;
    }
    const actualDomElement = document.createElement(reactElementOrStringOrNumber.tag);
    if (reactElementOrStringOrNumber.props) {
        for (const [key, value] of Object.entries(reactElementOrStringOrNumber.props.props)) {
            actualDomElement[key] = value
        }
    }
    console.log("actualDomElement", actualDomElement)
    if (reactElementOrStringOrNumber.props.children) {
        reactElementOrStringOrNumber.props.children.forEach(child => render(child, actualDomElement));
    }
    container.appendChild(actualDomElement);
}

render(<App/>, document.querySelector('#app'))
