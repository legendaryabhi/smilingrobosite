// pages/terms.js
import React from 'react';

export default function Terms() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100 p-4 sm:p-24">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms and Conditions</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Introduction</h2>
          <p className="text-gray-700">
            Welcome to SmilingRobo. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before using our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ownership and Attribution</h2>
          <p className="text-gray-700">
            All projects listed on SmilingRobo are created by their respective owners. We feature these projects because they are open-source, and we provide them for the benefit of the community. Each project remains the intellectual property of its creator, and appropriate credit is given to the authors.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ownership and Attribution</h2>
          <p className="text-gray-700">
            All projects listed on SmilingRobo are uploaded by users must agree to the terms and conditions of the platform or they can be deleted. </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Open-Source Licensing</h2>
          <p className="text-gray-700">
            Projects featured on our platform are available under their respective open-source licenses. Users must adhere to the terms specified by the license of each project. We encourage users to review and comply with the licensing agreements attached to the projects they use or contribute to.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Usage of the Platform</h2>
          <p className="text-gray-700">
            Users are welcome to explore and use the projects available on SmilingRobo. However, any misuse of the platform, including but not limited to unauthorized access, distribution of malicious software, or other harmful activities, is strictly prohibited.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Content Submission</h2>
          <p className="text-gray-700">
            By submitting a project to SmilingRobo, you confirm that you have the right to do so and that the project complies with all applicable laws and regulations. You also agree to allow SmilingRobo to feature and distribute your project as part of our open-source offerings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Limitation of Liability</h2>
          <p className="text-gray-700">
            SmilingRobo is not liable for any damages or losses resulting from the use of projects featured on our platform. Users assume full responsibility for their actions and the use of any projects obtained through SmilingRobo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Changes to Terms and Conditions</h2>
          <p className="text-gray-700">
            We reserve the right to modify these terms and conditions at any time. Any changes will be posted on this page, and users are encouraged to review the terms regularly to stay informed about their responsibilities and rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions or concerns about these terms and conditions, please contact us at <a href="mailto:support@smilingrobo.com" className="text-blue-600 hover:underline">smilingrobo@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
