"use client";
import Cards from "./components/Cards";
import { DataTable } from "./components/Dashtable";
import Navbar from "./components/Navbar";
import CreateLinkDialog from "./components/CreateLinkDialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const page = () => {
  const [formData, setFormData] = useState([]);
  const [cardData, setCardData] = useState({});
  const { userProfile } = useAuth();

  // console.log("userProfile in dashboard page:", userProfile?.user_id);

  useEffect(() => {
    const getData = async () => {
      try {
        if (!userProfile?.user_id) {
          return;
        }

        // console.log("Fetching forms for user ID:", userProfile.user_id);

        const { data: Allforms, error } = await supabase
          .from("need_analysis_form")
          .select("*")
          .eq("user_id", userProfile.user_id);

        if (error) {
          console.error("Error fetching forms:", error);
          return;
        }
        // console.log(`Found forms for user:`, Allforms);

        setFormData(Allforms);
        setCardData({
          completedForms: Allforms.filter((form) => form.status === "completed")
            .length,
          inProgress: Allforms.filter((form) => form.status === "pending")
            .length,
          categories: {
            health:
              Allforms.filter(
                (form) =>
                  form.status === "completed" && form.health_covers?.length >= 1
              ).length || 0,
            education:
              Allforms.filter(
                (form) =>
                  form.status === "completed" &&
                  form.insurance_needs.includes("higherEducationChildren")
              ).length || 0,
            pensionfund:
              Allforms.filter(
                (form) =>
                  form.status === "completed" &&
                  form.insurance_needs.includes("pensionFund")
              ).length || 0,
            DependentsCostofLiving:
              Allforms.filter(
                (form) =>
                  form.status === "completed" &&
                  form.insurance_needs.includes("dependentCostOfLiving")
              ).length || 0,
            longTermSavings:
              Allforms.filter(
                (form) =>
                  form.status === "completed" &&
                  form.insurance_needs.includes("longTermSavings")
              ).length || 0,
            shortTermSavings:
              Allforms.filter(
                (form) =>
                  form.status === "completed" &&
                  form.insurance_needs.includes("shortTermSavings")
              ).length || 0,
          },
        });
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    getData();
  }, [userProfile?.user_id]);

  return (
    <ProtectedRoute requireApproval={true}>
      <div className="bg-[var(--primary-50)]/4">
        <div className="min-h-screen max-w-7xl px-6 py-2 md:px-6 md:py-2 lg:px-10 lg:py-2 mx-auto">
          <Navbar />
          <Cards cardData={cardData} />
          <div className=" flex justify-end my-4">
            <CreateLinkDialog />
          </div>
          <DataTable formData={formData} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default page;
