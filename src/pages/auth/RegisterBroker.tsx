import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Shield, CheckCircle } from "lucide-react";
import { mockData, mockAuth } from "@/lib/mockData";
import { useAuth } from "@/store/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const RegisterBroker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    licenseNumber: "",
    countryState: "",
    phone: "",
    identificationFile: null as File | null,
    successProofFile: null as File | null,
    references: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "identificationFile" | "successProofFile",
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileName = `${folder}/${user?.id}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from("gallery").upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply as a broker",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let identificationUrl = "";
      let successProofUrl = "";

      // Upload files if provided
      if (formData.identificationFile) {
        identificationUrl = await uploadFile(formData.identificationFile, "broker-documents/identification");
      }

      if (formData.successProofFile) {
        successProofUrl = await uploadFile(formData.successProofFile, "broker-documents/success-proof");
      }

      // Parse references
      const references = formData.references
        .split("\n")
        .filter((ref) => ref.trim())
        .map((ref) => ({ contact: ref.trim() }));

      // Submit broker application
      const { error } = await supabase.from("broker_applications").insert({
        user_id: user.id,
        full_name: formData.fullName,
        company: formData.company,
        license_number: formData.licenseNumber || null,
        country_state: formData.countryState,
        phone: formData.phone,
        identification_document_url: identificationUrl || null,
        success_proof_document_url: successProofUrl || null,
        reference_contacts: references,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your broker application has been submitted for review. We'll contact you within 24-48 hours.",
      });

      navigate("/client/dashboard");
    } catch (error) {
      console.error("Error submitting broker application:", error);
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert>
              <AlertDescription>
                You must be logged in to apply as a broker. Please{" "}
                <a href="/auth/login" className="text-primary hover:underline">
                  sign in
                </a>{" "}
                first.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Become a Verified Broker</h1>
            <p className="text-muted-foreground text-lg">
              Join our exclusive network of verified digital asset brokers and earn premium commissions
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Verification Process
              </CardTitle>
              <CardDescription>
                All broker applications undergo rigorous KYC/AML verification to ensure platform security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                  <h3 className="font-semibold">Identity Verification</h3>
                  <p className="text-sm text-muted-foreground">Government-issued ID required</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                  <h3 className="font-semibold">Track Record</h3>
                  <p className="text-sm text-muted-foreground">Proof of successful transactions</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                  <h3 className="font-semibold">References</h3>
                  <p className="text-sm text-muted-foreground">Professional references check</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Broker Application</CardTitle>
              <CardDescription>Complete this form to begin the verification process</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Legal Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company/Organization *</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      placeholder="ABC Digital Assets LLC"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseNumber">License Number (if applicable)</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="License or registration number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="countryState">Country/State *</Label>
                    <Input
                      id="countryState"
                      name="countryState"
                      value={formData.countryState}
                      onChange={handleInputChange}
                      required
                      placeholder="United States, Texas"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="identification">Government-Issued ID *</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="identification"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "identificationFile")}
                      className="hidden"
                    />
                    <label
                      htmlFor="identification"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm">
                          {formData.identificationFile ? formData.identificationFile.name : "Upload ID Document"}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 10MB)</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="successProof">Proof of Success (Optional)</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="successProof"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "successProofFile")}
                      className="hidden"
                    />
                    <label
                      htmlFor="successProof"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm">
                          {formData.successProofFile ? formData.successProofFile.name : "Upload Transaction Records"}
                        </p>
                        <p className="text-xs text-muted-foreground">Screenshots, certificates, reports</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="references">Professional References</Label>
                  <Textarea
                    id="references"
                    name="references"
                    value={formData.references}
                    onChange={handleInputChange}
                    placeholder="Enter contact information for professional references (one per line)&#10;Example:&#10;John Smith - CEO, Digital Corp - john@digitalcorp.com&#10;Jane Doe - Partner, Investment LLC - jane@investment.com"
                    rows={4}
                  />
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    By submitting this application, you agree to our KYC/AML verification process and acknowledge that
                    all information provided is accurate and complete.
                  </AlertDescription>
                </Alert>

                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? "Submitting Application..." : "Submit Broker Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterBroker;
