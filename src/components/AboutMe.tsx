import stackSvg from '../assets/icons/circleIcons/stack.svg'
import booksSvg from '../assets/icons/circleIcons/books.svg'
import checkmarkSvg from '../assets/icons/circleIcons/checkmark.svg'
import speedometerSvg from '../assets/icons/circleIcons/speedometer.svg'
import toolsSvg from '../assets/icons/circleIcons/tools.svg'
import monitorSvg from '../assets/icons/circleIcons/monitor.svg'
import linkedinSvg from '../assets/icons/linkedin.svg'

const aboutData = [
  {
    image: stackSvg,
    title: 'Full Stack Development',
    subtitle: 'Building versatile applications from front to back',
    alt: 'Stack of 3 squares',
  },
  {
    image: monitorSvg,
    title: 'Developer Experience',
    subtitle: 'Empowering productive devs through efficient tooling and clear documentation',
    alt: 'Computer monitor',
  },
  {
    image: checkmarkSvg,
    title: 'Software Testing',
    subtitle: 'Ensuring software quality with unit, integration, and E2E tests',
    alt: 'Checkmark',
  },
  {
    image: speedometerSvg,
    title: 'Agile Methodologies',
    subtitle: 'Implementing Kanban and Scrum for efficient and transparent project management',
    alt: 'Speedometer',
  },
  {
    image: booksSvg,
    title: 'Mentoring',
    subtitle: 'Fostering professional growth and knowledge sharing',
    alt: '3 books',
  },
  {
    image: toolsSvg,
    title: 'Continuous Integration & Deployment',
    subtitle: 'Automating software delivery',
    alt: 'Wrench and Screwdriver',
  },
]

export const AboutMe = () => {
  return (
    <div className="mx-14 text-center">
      <p className="pt-6 font-body leading-relaxed text-gray-700">
        <br /> I&apos;m a software engineer based in Saint Louis.
        <br /> My specialty is full-stack development with Node.js, Javascript/Typescript, React,
        .NET framework w/ C#, SQL, and NoSQL.
        <br /> I am passionate about building high-quality software and fostering a collaborative
        and inclusive work environment.
        <br /> For a copy of my full resume, please send me a message on LinkedIn.
      </p>
      <ConnectWithMe />
      <div>
        <h2 className="my-10 text-center font-header text-3xl font-semibold uppercase text-primary sm:text-4xl lg:text-5xl ">
          What I offer
        </h2>
        <div className="mx-auto max-w-5xl">
          <div className="-mx-2 flex flex-wrap">
            {aboutData.map(({ title, subtitle, alt, image }, index) => (
              <div
                id={`card-${index}`}
                key={index}
                className="flex flex-col items-center py-5 md:w-1/2"
              >
                <img src={image} className="mb-4" alt={alt} />
                <h2 className="mb-2 font-header text-xl font-semibold">{title}</h2>
                <h3 className="italic text-gray-700">{subtitle}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const ConnectWithMe = () => {
  return (
    <div className="flex flex-col justify-center py-10 md:flex-row">
      <div className="flex items-center justify-center">
        <p className="font-header font-semibold uppercase text-gray-700">Connect with me &nbsp;</p>
      </div>
      <div className="flex items-center justify-center  transition-all hover:scale-110">
        <a href="https://www.linkedin.com/in/devcjohn">
          <img src={linkedinSvg} className="h-10 w-10" alt="LinkedIn Logo" />
        </a>
      </div>
    </div>
  )
}
