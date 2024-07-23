import Image from "next/image"
import Link from "next/link"
import profileImg from "../../../public/logo.png"

const Logo = () => {
  return (
    <Link href="/" className="flex items-center text-dark dark:text-light">
        <div className=" w-12 md:w-16 rounded-full overflow-hidden  mr-2 md:mr-4">
            <Image src={profileImg} alt="Smiling Robo Logo" className="w-full h-auto rounded-full" sizes="20vw" priority />
        </div>
        <h1 className="font-bold dark:font-semibold text-lg md:text-xl hidden md:block text-white">SmilingRobo</h1>
        {/* <h1 className="hidden ">SmilingRobo- Opensource Robotics Platform</h1> */}
        
    </Link>
  )
}

export default Logo