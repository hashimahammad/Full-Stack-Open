import '../notification.css'

const Notification = ({message,css})=>{
    if (message === '' || message === null){
        return null
    }

    return(
        <div className={css}>{message}</div>
    )
}

export default Notification