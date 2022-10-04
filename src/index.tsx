import jsx, { Bootstrap, useState, useOnKey } from './framework';

export const X = () => {
  const [value, setValue] = useState(0);
  useOnKey('w', () => setValue(Math.min(100, value + 10)));
  useOnKey('s', () => setValue(Math.max(0, value - 10)));
  return (<boxElement width={30} height={20} border='line'>
    {value}
    <progressBar top={2} left={2} width={20} height={3} filled={value} ch={':'} border="line"/>
  </boxElement>);
};

Bootstrap(X);