import { ReactNode } from "react"
import Button from "../button"


export default function CardDetail(props: {
  key: string,
  id: string,
  hint: string, 
  answer: string,
  onCardUpdate: () => {}
}) {

    const handleCardDeletion = async() => {

        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }
        try {
            console.log(`http://localhost:8080/api/cards/{id}`)
            const res = await fetch(`http://localhost:8080/api/cards/${props.id}`, requestOptions);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
        }
        catch (err: any) {
        //setError(err.message);
        } finally {
            
            props.onCardUpdate();
        }
        }

    return (
                    
   <li className="pb-3 sm:pb-2 sm:pt-2">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">

         <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
               {props.hint}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
               {props.answer}
            </p>
         </div>
         <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            <Button onClick={() => {}}>
                Edit
            </Button>
            <Button onClick={() => handleCardDeletion()}>
                Delete
            </Button>
         </div>
      </div>
   </li>
    )
}