import "../styles/ex.css";

function Privacy() {
  return (
    <div className="flex justify-center items-center text-white custom-height mb-[25rem]">
      <div className="pri">
        <h2 className="font-bold">Our Privacy Policy</h2>
        <br />
        <p>
          <b>
            By using any of the services we provide, you agree to accept the
            practices and terms of our privacy policy.
          </b>
          <br />
          <br />
          <h4>Cookies</h4>
          When visiting this website, we utilize cookies for essential
          functionalities, such as maintaining user sessions, displaying
          uploaded files, and additionally certain third party services we use
          utilize cookies.
          <br />
          Cloudflare
          <br />
          Backblaze
          <br />
          <br />
          <h4>Data Usage:</h4>
          Information stored on our servers are only used for the proper
          functioning of our service. We do not share any saved information with
          third parties, except with Backblaze. All images are saved to
          Backblaze to ensure redundancy and safeguard against any potential
          issues with our servers. Access to this information is restricted to
          our team only.
          <br />
          <br />
          <h4>Data Collection:</h4>
          The only data we collect are: Files uploaded to our servers Email
          addresses, usernames, and hashed passwords
          <br />
          <br />
          <h4>Data Retention:</h4>
          Data stored on our servers do not expire. Uploaded files remain
          available indefinitely, only being deleted if they violate our terms
          of service or if the owner removes them.
          <br />
          <br />
          <h4>Security</h4>
          While we employ security measures such as password encryption and SSL,
          we cannot guarantee 100% effectiveness. Usage of our service entails
          inherent risks. Files stored on our servers remain secure until shared
          with third parties, at which point they become the responsibility of
          the you, the user.
          <br />
          <br />
          <h4>Privacy Policy Amendments</h4>
          Picto retains the right to amend its Privacy Policy at any time. Picto
          advises you to regularly review the Privacy Policy for any updates.
        </p>
      </div>
    </div>
  );
}

export default Privacy;
