const name = "hello";

const makeFunc = () => {
   
  const name = "Closure Func";

  const dispalyName = () => {
    console.log(name);
  };

  return dispalyName;
};

const myFunc = makeFunc();

myFunc();