import FormContainer from "@/components/FormContainer";

export default function Form1Page() {
  return (
    <main className="min-h-screen bg-gray-100 flex justify-center pt-28 pb-10">
      <FormContainer>
        <p className="text-center text-gray-500"></p>

        {/* Back & Next buttons */}
        <div className="flex justify-between mt-110">
          <button
            className="px-6 py-3 rounded-full text-white font-medium shadow-md hover:shadow-lg transition 
                       bg-gradient-to-r from-[#89ACD0] to-[#2662B0]"
          >
            ← Back
          </button>

          <button
            className="px-6 py-3 rounded-full text-white font-medium shadow-md hover:shadow-lg transition 
                       bg-gradient-to-r from-[#89ACD0] to-[#2662B0]"
          >
            Next →
          </button>
        </div>
      </FormContainer>
    </main>
  );
}
