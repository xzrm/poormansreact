let React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag == "function") {
      try {
        return tag(props);
      } catch ({ promise, key }) {
        promise.then((data) => {
          console.log(promise);
          promiseCache.set(key, data);
          rerender();
        });
        return { tag: "h1", props: { children: ["I AM LOADING"] } };
      }
    }
    const element = { tag, props: { props, children } };
    console.log(element);
    return element;
  },
};

const states = [];
let stateCursor = 0;

const useState = (initialState) => {
  const FROZENCURSOR = stateCursor;
  states[FROZENCURSOR] = states[FROZENCURSOR] || initialState;
  const setState = (newState) => {
    states[FROZENCURSOR] = newState;
    rerender();
  };
  stateCursor++;
  return [states[FROZENCURSOR], setState];
};

const promiseCache = new Map();

const createResource = (aPromise, key) => {
  if (promiseCache.has(key)) {
    return promiseCache.get(key);
  }
  throw { promise: aPromise(), key };
};

const App = () => {
  const [name, setName] = useState("person");
  const [count, setCount] = useState(0);

  const dogPhotoUrl = createResource(
    () =>
      fetch("https://dog.ceo/api/breeds/image/random")
        .then((r) => r.json())
        .then((payload) => payload.message),
    "dogPhoto"
  );

  return (
    <div className="test class name">
      <h1 className="test h1">Hello, {name}</h1>
      <input
        value={name}
        onchange={(e) => setName(e.target.value)}
        type="text"
        placeholder="name"
      />
      <h2>{count}</h2>
      <button onclick={() => setCount(count + 1)}>+</button>
      <button onclick={() => setCount(count - 1)}>-</button>
      <img alt="good boi" src={dogPhotoUrl} />
      <p>lorem ipsum </p>
    </div>
  );
};

const render = (reactElementOrStringOrNumber, container) => {
  if (["string", "number"].includes(typeof reactElementOrStringOrNumber)) {
    container.appendChild(
      document.createTextNode(String(reactElementOrStringOrNumber))
    );
    return;
  }
  const actualDomElement = document.createElement(
    reactElementOrStringOrNumber.tag
  );
  if (reactElementOrStringOrNumber.props) {
    if (reactElementOrStringOrNumber.props.props) {
      for (const [key, value] of Object.entries(
        reactElementOrStringOrNumber.props.props
      )) {
        actualDomElement[key] = value;
      }
    }
  }
  console.log("actualDomElement", actualDomElement);
  if (reactElementOrStringOrNumber.props.children) {
    reactElementOrStringOrNumber.props.children.forEach((child) =>
      render(child, actualDomElement)
    );
  }
  container.appendChild(actualDomElement);
};

const rerender = () => {
  stateCursor = 0;
  document.querySelector("#app").firstChild.remove();
  render(<App />, document.querySelector("#app"));
};

render(<App />, document.querySelector("#app"));
