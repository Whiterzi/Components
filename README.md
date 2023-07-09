# Components

react components made by myself

## Calendar  
dependency : `date-fns`  
usage:
```JavaScript
import CalendarProvider from '../Calendar/Calendar';
const main = ()=>{
  const [date , setDate] = useState(); //define a state to get date information from calendar
  return(
    <CalendarProvider getDate={setDate}>
      <div>Trigger</div>
    </CalendarProvider>
)}
```
