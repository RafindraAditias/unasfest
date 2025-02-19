"use client";

import { useEffect, useState } from "react";
import { Activities } from "@/constants/Activites";
import Image from "next/image";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import InfiniteSliding from "@/components/shared/InfiniteSlidingComponent/InfiniteSlidingComponent";
import FaqActivities from "@/components/shared/FaqActivities/FaqActivities";
import TimelineCards from "@/components/ui/timelineCards";
import Judges from "@/components/shared/Judges/Judges";
import Contact from "@/components/shared/Contact/Contact";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Slider from "@/components/shared/Slider/Slider";
import toa from "@/public/assets/images/competition/toa.png";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";

type DetailCompetitionProps = { params: Promise<{ slug: string }> };

export default function DetailCompetition({ params }: DetailCompetitionProps) {
  const [competition, setCompetition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCompetition() {
      const resolvedParams = await params; // Unwrap params (async)

      // Find the competition based on the slug
      const foundCompetition = Activities.find(
        (comp) => comp.path === resolvedParams.slug,
      );

      if (!foundCompetition) {
        toast({
          duration: 2000,
          variant: "destructive",
          title: "Kompetisi tidak ditemukan",
        });
      } else {
        setCompetition(foundCompetition);
      }
    }

    fetchCompetition();
  }, [params, toast]);

  if (!competition) {
    return (
      <div className="flex h-full min-h-[90vh] w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      </div>
    );
  }

  const requirementsData = competition.requirements || [];
  const InfiniteSlidingProps = {
    icon: competition.infiniteSlidingIcon?.src || "",
    text: competition.infiniteSlidingText || "",
  };

  function passRegist() {
    toast({
      duration: 2000,
      variant: "destructive",
      title: "Registration Period Ended",
    });
  }

  return (
    <section>
      <div className="container mx-auto mt-10 md:mt-16">
        <h1
          className={`mb-5 font-bungee uppercase leading-none tracking-wide md:text-4xl ${
            competition.path === "seminar-international"
              ? "text-3xl"
              : "text-2xl"
          } text-center md:mb-9 md:text-start md:font-semibold lg:text-5xl`}
          style={{ color: competition.color }}
        >
          {competition.title}
        </h1>
        <Image
          src={competition.coverImage}
          alt={competition.title}
          width={1400}
          height={480}
          className="mx-auto sm:-mb-[70px] md:-mb-[200px]"
        />
      </div>
      <div
        style={{ backgroundColor: competition.color }}
        className="mx-auto w-full text-page-white sm:pt-[50px] md:pt-[200px]"
      >
        {/* HERO */}
        <Card className="container relative mb-12 flex flex-col items-center justify-center overflow-hidden rounded-none pb-2 text-center align-middle">
          <div className="flex flex-col items-center justify-center">
            <CardContent>
              <CardDescription className="text-start text-sm text-white md:text-xl">
                {competition.description}
              </CardDescription>
              <div className="mt-10 flex gap-5">
                <Button
                  size="xl"
                  variant="secondary"
                  className="text-page-black"
                  onClick={passRegist}
                >
                  Register
                </Button>
                <Link href="#requirements" className="scroll-smooth">
                  <Button
                    size="xl"
                    variant="outline"
                    className="bg-transparent"
                  >
                    See More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* INFINITE SLIDING */}
        <div className="z-50 mb-10 h-32 w-full overflow-hidden pt-10 text-page-black md:overflow-visible">
          <InfiniteSliding props={InfiniteSlidingProps} />
        </div>

        {/* REQUIREMENTS */}
        <Card
          id="requirements"
          className="container relative mx-auto mb-12 overflow-hidden rounded-none pb-2 text-center"
        >
          <CardTitle className="text-3xl font-semibold leading-normal tracking-wide lg:text-5xl">
            Competition Requirements
          </CardTitle>
          <CardDescription className="mb-16 text-sm font-normal leading-normal tracking-wide text-page-white lg:text-xl">
            {competition.requirementsTitle}
          </CardDescription>
          <CardContent className="p-0 pb-16 md:p-6">
            <Slider props={requirementsData} />
          </CardContent>
        </Card>

        {/* DOWNLOAD GUIDE BOOK */}
        <Card className="relative m-auto mb-12 flex w-full max-w-screen-xl flex-col items-center justify-center overflow-hidden rounded-none pb-20 text-center align-middle sm:w-[90%]">
          <CardTitle className="mb-5 text-3xl font-semibold leading-normal tracking-wide md:text-4xl lg:text-5xl">
            {competition.path === "international-seminar"
              ? ""
              : "Download guidebook"}
          </CardTitle>
          {competition.path !== "international-seminar" && (
            <>
              <CardDescription className="mb-5 max-w-xl text-center font-normal leading-normal tracking-wide text-page-white sm:text-base md:text-xl">
                Download the competition guidebook to find out the overall
                mechanism of the Universitas Nasional Festival competition.
              </CardDescription>
              <Link href={competition.guideBook || "#"} target="_blank">
                <Button
                  variant="secondary"
                  className="mt-6 flex w-[235px] items-center gap-2 rounded-none py-8 text-xl"
                >
                  <Download />
                  Download
                </Button>
              </Link>
            </>
          )}
        </Card>
      </div>

      {/* TIMELINE */}
      <TimelineCards
        title="Activity Timeline"
        description="Pay attention to the time and date"
        timelines={competition.timeline}
      />

      {/* JUDGES */}
      {competition.path !== "international-seminar" && (
        <Card className="relative m-auto mb-12 flex w-full max-w-screen-xl flex-col items-center justify-center overflow-hidden rounded-none pb-20 text-center align-middle lg:w-[90%]">
          <CardTitle className="text-3xl font-semibold leading-normal tracking-wide lg:text-5xl">
            Competition Judges
          </CardTitle>
          <CardDescription className="mb-16 text-sm font-normal leading-normal tracking-wide lg:text-xl">
            Competition Judges List
          </CardDescription>
          <CardContent className="h-full w-full px-0">
            <Judges judgesData={competition.judgesData || []} />
          </CardContent>
        </Card>
      )}

      {/* FAQ */}
      <div className="relative m-auto max-w-screen-xl">
        <Card className="relative flex min-h-60 w-full flex-col overflow-hidden rounded-none sm:justify-center lg:w-[90%] lg:justify-start">
          <CardTitle className="pb-5 text-3xl font-semibold leading-normal tracking-wide sm:text-center lg:w-3/5 lg:pl-12 lg:text-start lg:text-5xl">
            Frequently Asked Questions
          </CardTitle>
          <CardContent className="lg:w-3/4 lg:pl-12">
            <FaqActivities faqs={competition.faqs || []} />
          </CardContent>
        </Card>
        <Image
          src={toa}
          alt="toa"
          width={510}
          height={510}
          className="absolute -bottom-44 right-0 hidden lg:inline-block"
        />
      </div>

      {/* CONTACT */}
      <Card className="pt-0">
        <Contact
          contact={competition.contact}
          contactNumber={competition.contactNumber}
        />
      </Card>
    </section>
  );
}
