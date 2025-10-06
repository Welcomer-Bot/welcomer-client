import Image from "next/image"
import Link from "next/link"

export const Logo = () => {
    return (
        <Link className="flex justify-start items-center gap-2" href="/">
            <Image src="/logo.svg" alt={"Welcomer logo"} width={40} height={40} />
            <p className="font-bold text-lg text-inherit">Welcomer</p>
        </Link>
    )
}