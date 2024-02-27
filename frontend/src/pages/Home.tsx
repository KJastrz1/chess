import { useGetGameById } from "../lib/queries"


const Home = () => {
    const { data, error, isLoading } = useGetGameById('65dba4e8824a7a361f4fde92')

    const handleClick = () => {
        console.log('Create new game', data)

    }

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
                Create new game
            </button>
            {isLoading && <p>Loading...</p>}
          
        </div>
    )
}

export default Home
