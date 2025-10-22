const Header = ({text})=> <div><h1>{text}</h1></div>
const Part = ({text,exercise}) => <div>{text} {exercise}</div>

const Total = ({parts})=>{
    const total = parts.reduce((acc,part)=>{
        return acc + part.exercises
    },0)

    return <div>total of {total} exercises</div>
}

const Course = ({course})=>{
    return(
        <div>
            <Header text={course.name}></Header>
            {course.parts.map((part)=>{
                
                return (<Part text={part.name} exercise={part.exercises} key={part.id}/>)
            })}
            <Total parts={course.parts}></Total>
        </div>
    )
}

export default Course