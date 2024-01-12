export const AboutThisSite = () => (
  <div className="mb-20">
    <h1 className="text-center font-header text-4xl font-semibold uppercase text-primary sm:text-5xl lg:text-4xl">
      About this site
    </h1>
    <div className="flex flex-col items-center justify-center align-middle md:flex-row">
      <h2 className="font-header">
        View the source code for this website and the tools used to build it &nbsp; &nbsp;
      </h2>
      <a
        href="https://github.com/devcjohn/cj.cafe"
        className="transition-all hover:scale-110"
      >
        <img
          src="/img/github-mark.svg"
          className="h-16 w-16"
          title="Link to Github Repo"
          alt="Github Logo"
        />
      </a>
    </div>
  </div>
)
