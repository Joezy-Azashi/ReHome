import React, { useEffect } from 'react'
import { Grid } from '@mui/material';
import './t&cstyles.css'
import { motion } from "framer-motion";

function TermsCondition() {

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div style={{ backgroundColor: "#F7F7F7F7" }}>
                <Grid container spacing={4}>

                    <Grid  item xs={12} md={8}>
                        <div className="c16 doc-content">
                            <div>
                                <p className="c13 c19 paragraph"><span className="c11 c21"></span></p>
                            </div>
                            <p className="c23">
                                <span className="c4 c71">Terms and Conditions </span>
                                <p className="c2">Last updated: January 10, 2024</p>
                            </p>
                            
                            <p className="c0"><span className="c9">Please read these Terms and Conditions carefully before using the Service.</span></p>
                            
                            <div id="intepretations_and_definitions" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">Interpretation and Definitions</span></p>
                            <p className=""><span className="c4 c5">Interpretation</span></p>
                            <p className="c12"><span className="c9">The words with the initial letter capitalized have meanings defined under
                                Definitions. The following definitions shall have the same meaning regardless &nbsp;whether or not they
                                appear in singular or in plural.</span></p>
                            <p className=""><span className="c4 c5">Definitions</span></p>
                            <p className="c8"><span className="c9">For the purposes of these Terms and Conditions:</span></p>
                            <ul className="c0 c01">
                                <li className="c8 c10 li-bullet-0"><span className="c4">Application</span><span className="c3">&nbsp;means the software
                                    program named ReHome provided by the Company that User downloads on any electronic device. </span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Application Store</span><span className="c3">&nbsp;means the digital
                                    distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play
                                    Store) in which the Application is available for download.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Affiliate</span><span className="c3">&nbsp;means an entity that
                                    controls, is controlled by or is under common control with a party, where &quot;control&quot; means
                                    ownership of 50% or more of the shares, equity interest or other securities entitled to vote for
                                    election of directors or other managing authority.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Account</span><span className="c3">&nbsp;means the unique account
                                    created for User to access the Service or parts of the Service.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Country</span><span className="c3">&nbsp;means the Republic of Ghana
                                    (Ghana)</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Company</span><span className="c3">&nbsp;(referred to as either
                                    &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) means
                                    ReHome Realty LTD with address as 2nd Quartey Papafio Lane, Accra, Ghana.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Content</span><span className="c3">&nbsp;means content such as text,
                                    images, or other information that can be posted, uploaded, linked to or otherwise made available by
                                    User, regardless of the form of that content.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Device</span><span className="c3">&nbsp;means any electronic (?)
                                    device that can access the Service such as a computer, a cellphone or a digital tablet.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Feedback</span><span className="c3">&nbsp;means feedback,
                                    innovations or suggestions sent by User regarding the attributes, performance or features of the
                                    Service.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">In-app Purchase</span><span className="c3">&nbsp;means the purchase
                                    of a product, item, service or Subscription made through the Application which is subject to these Terms
                                    and Conditions and/or the Application Store&#39;s own terms and conditions.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Promotions</span><span className="c3">&nbsp;means contests,
                                    sweepstakes or other promotions offered through the Service.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Service</span><span className="c3">&nbsp;means the Application or
                                    the Website or both.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Subscriptions</span><span className="c3">&nbsp;means the services or
                                    access to the Service offered on a subscription basis by the Company to everyone including User.</span>
                                </li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Terms and Conditions</span><span className="c3">&nbsp;mean these
                                    terms and conditions that form the entire agreement between User and the Company regarding the use of
                                    the Service.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Third-party Social Media Service</span><span
                                    className="c3">&nbsp;means any services or content (including data, information, products or services)
                                    provided by a third-party that may be displayed, included or made available by the Service.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">Website</span><span className="c9">&nbsp;refers to ReHome,
                                    accessible from </span>
                                    <span className="c17">
                                        {/* <a className="c14" href="https://www.google.com/url?q=http://docs.google.com/www.rehomeafrica.com&amp;sa=D&amp;source=editors&amp;ust=1674945706968903&amp;usg=AOvVaw0xsDA77gM7M97z4qBex58B">www.rehomeafrica.com</a> */}
                                        <a className="c14" href={`//${'www.rehomeafrica.com'}`} target="_blank" rel="noreferrer" style={{ color: "blue" }}>www.rehomeafrica.com</a>
                                    </span>
                                </li>
                                <li className="c8 c10 li-bullet-0"><span className="c4">User</span><span className="c3">&nbsp;means the individual accessing
                                    or using the Service, or the Company, or other legal entity on behalf of which such individual is
                                    accessing or using the Service, as applicable.</span></li>
                            </ul>
                            <div id="acknowledgement" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">Acknowledgment</span></p>
                            <p className="c8"><span className="c9">These are the Terms and Conditions governing the agreement between User and the
                                Company for the use of this Service. These Terms and Conditions set out the rights and obligations of all
                                users of the Service.</span></p>
                            <p className="c8"><span className="c9">User&rsquo;s access to and use of the Service is conditioned on User&rsquo;s
                                acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to visitors,
                                users and everyone who access or use the Service.</span></p>
                            <p className="c8"><span className="c9">By accessing or using the Service User agrees to be bound by these Terms and
                                Conditions. If User disagrees with any part of these Terms and Conditions then User may not access the
                                Service.</span></p>
                            <p className="c8"><span className="c9">User represents that User is over the age of 18. The Company does not permit those
                                under 18 years of age to use the Service.</span></p>
                            <p className="c0"><span className="c3">User&rsquo;s access to and use of the Service is also conditioned on User&rsquo;s
                                acceptance of and compliance with the Privacy Policy of the Company. The Privacy Policy describes the
                                Company&rsquo;s policies and procedures on the collection, use and disclosure of User&rsquo;s personal
                                information when User uses &nbsp;the Application or the Website. The Company&rsquo;s Privacy Policy
                                &nbsp;tells User about User&rsquo;s privacy rights and how the law protects User. </span></p>
                            <p className="c0"><span className="c9">Please read the Privacy Policy carefully before using the Service.</span></p>
                            
                            <div id="subscriptions" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">Subscriptions</span></p>
                            <p className=""><span className="c4 c5">Subscription period</span></p>
                            <p className="c8"><span className="c9">The Service or some parts of the Service are available only with a paid Subscription.
                                User will be billed in advance on a recurring and periodic basis (such as daily, weekly, monthly or
                                annually), depending on the type of Subscription plan User selects when purchasing the Subscription.</span>
                            </p>
                            <p className="c12"><span className="c9">At the end of each period, User&rsquo;s Subscription will automatically renew under
                                the exact same conditions unless User cancels it or the Company cancels it.</span></p>
                            <p className=""><span className="c4 c5">Subscription cancellations</span></p>
                            <p className="c8"><span className="c9">User may cancel User&rsquo;s Subscription either through User&rsquo;s Account
                                settings page or by contacting the Company. User will not receive a refund for the fees User already paid
                                for User&rsquo;s current Subscription period. User will be able to access the Service until the end of
                                User&rsquo;s paid for current Subscription period.</span></p>
                            <p className="c12"><span className="c3">If the Subscription has been made through an In-app Purchase, User can cancel the
                                renewal of User&rsquo;s Subscription with the Application Store.</span></p>
                            <p className="c12 c13"><span className="c3"></span></p>
                            <p className="c12 c13"><span className="c4 c11 c5"></span></p>
                            <p className=""><span className="c4 c5">Billing</span></p>
                            <p className="c8"><span className="c9">User shall provide the Company with accurate and complete billing information
                                including full name, address, state, zip code, telephone number, and a valid payment method information. For
                                countries with no zip codes, the User shall use </span><span className="c9">0000</span><span className="c9">.</span>
                            </p>
                            <p className="c8"><span className="c9">Should automatic billing fail to occur for any reason, the Company will issue an
                                electronic invoice indicating that User must proceed manually, within a certain deadline date, with the full
                                payment corresponding to the billing period as indicated on the invoice.</span></p>
                            <p className="c12"><span className="c9">If the Subscription has been made through an In-app Purchase, all billing shall be
                                handled by the Application Store and is governed by the Application Store&#39;s own terms and
                                conditions.</span></p>
                            <p className=""><span className="c4 c5">Fee Changes</span></p>
                            <p className="c8"><span className="c9">The Company, in its sole discretion and at any time, may revise the Subscription
                                fees. Any Subscription fee change will become effective at the end of a Subscription validity period.</span>
                            </p>
                            <p className="c8"><span className="c9">The Company will provide User with reasonable prior notice of any change in
                                Subscription fees to give User an opportunity to terminate User Subscription before such change becomes
                                effective.</span></p>
                            <p className="c12"><span className="c9">User&rsquo;s continued use of the Service after the Subscription fee change comes
                                into effect constitutes User&rsquo;s agreement to pay the revised Subscription fee.</span></p>
                            <p className=""><span className="c4 c5">Refunds</span></p>
                            <p className="c8"><span className="c9">Except when required by law, Subscription fees when paid are non-refundable.</span>
                            </p>
                            <p className="c8"><span className="c9">Certain refund requests for Subscriptions may be considered by the Company on a
                                case-by-case basis and granted at the sole discretion of the Company.</span></p>
                            <p className="c0"><span className="c9">If the Subscription has been made through an In-app Purchase, the Application
                                Store&#39;s refund policy will apply. If User wishes to request a refund, User may do so by contacting the
                                Application Store directly.</span></p>
                            
                            <div id="in_app_purchases" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">In-app Purchases</span></p>
                            <p className="c8"><span className="c9">The Application may include In-app Purchases that allow User to buy products,
                                services or Subscriptions.</span></p>
                            <p className="c8"><span className="c9">More information about how User may be able to manage In-app Purchases using
                                User&rsquo;s device may be set out in the Application Store&#39;s own terms and conditions or in
                                User&rsquo;s device&#39;s Help settings.</span></p>
                            <p className="c8"><span className="c9">In-app Purchases can only be consumed within the Application. If
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;User makes an In-app Purchase, that In-app Purchase cannot
                                be cancelled after User has initiated its download. In-app Purchases cannot be redeemed for cash or other
                                consideration or otherwise transferred.</span></p>
                            <p className="c8"><span className="c9">If any In-app Purchase is not successfully downloaded or does not work once it has
                                been successfully downloaded, the Company will, after becoming aware of the fault or being notified to the
                                fault by User, investigate the reason for the fault. The Company shall be reasonable in considering whether
                                to provide User with a replacement In-app Purchase or issue User with a patch to repair the fault. In no
                                event will the Company charge User to replace or repair the In-app Purchase. In the unlikely event that the
                                Company is unable to replace or repair the relevant In-app Purchase or are unable to do so within a
                                reasonable period of time and without significant inconvenience to User, the Company will authorize the
                                Application Store to refund User to the cost of the relevant In-app Purchase. Alternatively, if User wishes
                                to request a refund, User may do so by contacting the Application Store directly.</span></p>
                            <p className="c8"><span className="c9">User acknowledges and agrees that all billing and transaction processes are handled
                                by the Application Store where User downloaded the Application and are governed by that Application
                                Store&#39;s own terms and conditions.</span></p>
                            <p className="c0"><span className="c9">If User has any payment related issues with In-app Purchases, then User must contact
                                the Application Store directly.</span></p>
                            
                            <div id="promotions" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">Promotions</span></p>
                            <p className="c8"><span className="c9">Any Promotions made available through the Service may be governed by rules that are
                                separate from these Terms and Conditons.</span></p>
                            <p className="c0"><span className="c9">If User participates in any Promotions, the User must study the applicable rules as
                                well as the Company&rsquo;s Privacy Policy. If the rules for a Promotion conflict with these Terms and
                                Conditions, the Promotion rules will apply.</span></p>
                            
                            <div id="user_accounts" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">User Accounts</span></p>
                            <p className="c8"><span className="c9">When User creates an account with the Company, User must provide information that is
                                accurate, complete, and current at all times. Failure to do so constitutes a breach of these Terms and
                                Conditions, which may result in immediate termination of User&rsquo;s Account.</span></p>
                            <p className="c8"><span className="c9">User is responsible for safeguarding the password that User uses to access the
                                Service and for any activities or actions under User&rsquo;s password, whether User&rsquo;s password is with
                                the Service or a Third-Party Social Media Service.</span></p>
                            <p className="c8"><span className="c9">User agrees not to disclose User&rsquo;s password to any third party. User must
                                notify the Company immediately on becoming aware of any breach of security or unauthorized use of
                                User&rsquo;s account.</span></p>
                            <p className="c0"><span className="c3">User may not use as a username the name of another person or entity or that is not
                                lawfully available for use, a name or trademark that is subject to any rights of another person or entity
                                other than User without appropriate authorization, or a name that is otherwise offensive, vulgar or
                                obscene.</span></p>

                            <div id="content" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">Content</span></p>
                            <p className=""><span className="c4 c5">User&rsquo;s Right to Post Content</span></p>
                            <p className="c8"><span className="c9">The Service allows User to post Content. User is responsible for the Content that
                                User posts to the Service, including its legality, reliability, and appropriateness.</span></p>
                            <p className="c8"><span className="c9">By posting Content to the Service, User grants the Company the right and license to
                                use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the
                                Service. User retains any and all of User&rsquo;s rights to any Content User submits, posts or displays on
                                or through the Service and User is responsible for protecting those rights. User agrees that this license
                                includes the right of the Company to make User&rsquo;s Content available to other users of the Service, who
                                may also use User&rsquo;s Content subject to these Terms and Conditions.</span></p>
                            <p className="c12"><span className="c9">User represents and warrants that: (i) the Content is User&rsquo;s (User owns it) or
                                User has the right to use it and grants the Company the rights and license as provided in these Terms and
                                Conditions, and (ii) the posting of User&rsquo;s Content on or through the Service does not violate the
                                privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.</span></p>
                            <p className=""><span className="c4 c5">Content Restrictions</span></p>
                            <p className="c8"><span className="c9">The Company is not responsible for the content of the Service&#39;s users. User
                                expressly understands and agrees that User is solely responsible for the Content and for all activity that
                                occurs under User&rsquo;s account, whether done so by User or any third person using User&rsquo;s
                                account.</span></p>
                            <p className="c8"><span className="c9">User may not transmit any Content that is unlawful, offensive, upsetting, intended to
                                disgust, threatening, libelous, defamatory, obscene or otherwise objectionable. Examples of such
                                objectionable Content include, but are not limited to, the following:</span></p>
                            <ul className="c0 c01">
                                <li className="c8 c10 li-bullet-0"><span className="c3">Unlawful or promoting unlawful activity</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">Defamatory, discriminatory, or mean-spirited content, including
                                    references or commentary about religion, race, sexual orientation, gender, national/ethnic origin, or
                                    other targeted groups</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">Spam, machine &ndash; or randomly &ndash; generated,
                                    constituting unauthorized or unsolicited advertising, chain letters, any other form of unauthorized
                                    solicitation, or any form of lottery or gambling</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">Containing or installing any viruses, worms, malware, trojan
                                    horses, or other content that is designed or intended to disrupt, damage, or limit the functioning of
                                    any software, hardware or telecommunications equipment or to damage or obtain unauthorized access to any
                                    data or other information of a third person</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">Infringing on any proprietary rights of any party, including
                                    patent, trademark, trade secret, copyright, right of publicity or other rights</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">Impersonating any person or entity including the Company and its
                                    employees or representatives</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">Violating the privacy of any third person.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">False information and features</span></li>
                            </ul>
                            <p className="c12"><span className="c9">The Company reserves the right, but not the obligation, to, in its sole discretion,
                                determine whether or not any Content is appropriate and complies with these Terms and Conditions, refuse or
                                remove such Content. The Company further reserves the right to make formatting and edits and change the
                                manner of any Content. The Company can also limit or revoke the use of the Service if User posts such
                                objectionable Content. As the Company cannot control all content posted by users and/or third parties on the
                                Service, User agrees to use the Service at User&rsquo;s own risk. User understands that by using the Service
                                User may be exposed to content that User may find offensive, indecent, incorrect or objectionable, and User
                                agrees that under no circumstances will the Company be liable in any way for any content on the Service,
                                including any errors or omissions in any content, or any loss or damage of any kind incurred as a result of
                                User&rsquo;s use of any such content.</span></p>
                            <p className=""><span className="c4 c5">Content Backups</span></p>
                            <p className="c8"><span className="c3">Although regular backups of Content are performed, the Company does not guarantee
                                there will be no loss or corruption of data.</span></p>
                            <p className="c8"><span className="c9">Corrupt or invalid backup points may be caused by, without limitation, Content that
                                is corrupted prior to being backed up or that changes during the time a backup is performed.</span></p>
                            <p className="c8"><span className="c9">The Company will provide support and attempt to troubleshoot any known or discovered
                                issues that may affect the backups of Content. But User acknowledges that the Company has no liability
                                related to the integrity of Content or the failure to successfully restore Content to a usable state.</span>
                            </p>
                            <p className="c0"><span className="c9">User agrees to maintain a complete and accurate copy of any Content in a location
                                independent of the Service.</span></p>

                            <div id="copyright_policy" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">Copyright Policy</span></p>
                            <p className=""><span className="c4 c5">Intellectual Property Infringement</span></p>
                            <p className="c8"><span className="c9">The Company respects the intellectual property rights of others. It is its policy to
                                respond to any claim that Content posted on the Service infringes a copyright or other intellectual property
                                infringement of any person.</span></p>
                            <p className="c8"><span className="c9">If User is a copyright owner, or authorized on behalf of one, and User believes that
                                the copyrighted work has been copied in a way that constitutes copyright infringement that is taking place
                                through the Service, User must submit User&rsquo;s notice in writing to the attention of the Company&rsquo;s
                                copyright agent via email at </span>
                                <span className="c17">
                                    {/* <a className="c14" href="https://www.google.com/url?q=http://docs.google.com/cdn-cgi/l/email-protection&amp;sa=D&amp;source=editors&amp;ust=1674945706986308&amp;usg=AOvVaw0dR3z4w1ugAYtYgdm1tFFk">[email protected]</a> */}
                                    <a href={'mailto:legal@rehomeafrica.com'} target="_blank" rel="noreferrer" style={{ color: "blue" }}>legal@rehomeafrica.com</a>
                                </span><span className="c9">&nbsp;and include in User&rsquo;s notice a detailed description of
                                    the alleged infringement.</span></p>
                            <p className="c12"><span className="c9">User may be held accountable for damages (including costs and attorneys&#39; fees)
                                for misrepresenting that any Content is infringing User&rsquo;s copyright.</span></p>
                            <p className=""><span className="c4 c5">DMCA Notice and DMCA Procedure for Copyright Infringement Claims</span></p>
                            <p className="c8"><span className="c9">User may submit a notification pursuant to the Digital Millennium Copyright Act
                                (DMCA) by providing the Company&rsquo;s Copyright Agent with the following information in writing (see 17
                                U.S.C 512(c)(3) for further detail):</span></p>
                            <ul className="c0 c01">
                                <li className="c8 c10 li-bullet-0"><span className="c3">An electronic or physical signature of the person authorized to
                                    act on behalf of the owner of the copyright&#39;s interest.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">A description of the copyrighted work that User claims has been
                                    infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists
                                    or a copy of the copyrighted work.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">Identification of the URL or other specific location on the
                                    Service where the material that User claims is infringing is located.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">User&rsquo;s address, telephone number, and email
                                    address.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">A statement by User that User has a good faith belief that the
                                    disputed use is not authorized by the copyright owner, its agent, or the law.</span></li>
                                <li className="c8 c10 li-bullet-0"><span className="c3">A statement by User, made under penalty of perjury, that the
                                    above information in User&rsquo;s notice is accurate and that User are the copyright owner or authorized
                                    to act on the copyright owner&#39;s behalf.</span></li>
                            </ul>
                            <p className="c0"><span className="c9">User can contact our copyright agent via email at </span><span className="c17">
                                {/* <a className="c14" href="https://www.google.com/url?q=http://docs.google.com/cdn-cgi/l/email-protection&amp;sa=D&amp;source=editors&amp;ust=1674945706989432&amp;usg=AOvVaw2EwKMHur186BjJ4IiTFI2X">[email protected]</a> */}
                                <a href={'mailto:legal@rehomeafrica.com'} target="_blank" rel="noreferrer" style={{ color: "blue" }}>legal@rehomeafrica.com</a>
                            </span><span className="c17">.</span><span className="c9">&nbsp;Upon receipt of a notification,
                                the Company will take whatever action, in its sole discretion, it deems appropriate, including removal of
                                the challenged content from the Service.</span></p>
                            <p className="c0 c13"><span className="c4 c11 c7"></span></p>
                            <p className=""><span className="c4 c5">Intellectual Property</span></p>
                            <p className="c8"><span className="c9">The Service and its original content (excluding Content provided by User or other
                                users), features and functionality are and will remain the exclusive property of the Company and its
                                licensors.</span></p>
                            <p className="c8"><span className="c9">The Service is protected by copyright, trademark, and other laws of both the Country
                                and foreign countries.</span></p>
                            <p className="c0"><span className="c9">The Company&rsquo;s trademarks and trade dress may not be used in connection with any
                                product or service without the prior written consent of the Company.</span></p>
                            <p className=""><span className="c4 c5">User&rsquo;s Feedback to Us</span></p>
                            <p className="c0"><span className="c9">User assigns to the Company all rights, title and interest in any Feedback User
                                provides the Company. If for any reason such assignment is ineffective, User agrees to grant the Company a
                                non-exclusive, perpetual, irrevocable, royalty free, worldwide right and license to use, reproduce,
                                disclose, sub-license, distribute, modify and exploit such Feedback without restriction.</span></p>
                            <p className=""><span className="c4 c5">Links to Other Websites</span></p>
                            <p className="c8"><span className="c9">The Service may contain links to third-party web sites or services that are not owned
                                or controlled by the Company.</span></p>
                            <p className="c8"><span className="c9">The Company has no control over, and assumes no responsibility for, the content,
                                privacy policies, or practices of any third party web sites or services. User further acknowledges and
                                agrees that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss
                                caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or
                                services available on or through any such web sites or services.</span></p>
                            <p className="c0"><span className="c3">We strongly advise User to read the terms and conditions and privacy policies of any
                                third-party web sites or services that User visits.</span></p>
                            <p className=""><span className="c4 c5">Termination</span></p>
                            <p className="c8"><span className="c9">The Company may terminate or suspend User&rsquo;s Account immediately, without prior
                                notice or liability, for any reason whatsoever, including without limitation if User breaches these Terms
                                and Conditions.</span></p>
                            <p className="c0"><span className="c9">Upon termination, User&rsquo;s right to use the Service will cease immediately. If
                                User wishes to terminate User&rsquo;s Account, User may simply discontinue using the Service.</span></p>
                            
                            <div id="limitation_of_liability" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">Limitation of Liability</span></p>
                            <p className="c8"><span className="c9">Notwithstanding any damages that User might incur, the entire liability of the
                                Company and any of its suppliers under any provision of these Terms and Conditions and User&rsquo;s
                                exclusive remedy for all of the foregoing shall be limited to the amount actually paid by User through the
                                Service or 100 USD if User has not purchased anything through the Service.</span></p>
                            <p className="c8"><span className="c9">To the maximum extent permitted by applicable law, in no event shall the Company or
                                its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever
                                (including, but not limited to, damages for loss of profits, loss of data or other information, for business
                                interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or
                                inability to use the Service, third-party software and/or third-party hardware used with the Service, or
                                otherwise in connection with any provision of these Terms and Conditions), even if the Company or any
                                supplier has been advised of the possibility of such damages and even if the remedy fails of its essential
                                purpose.</span></p>
                            <p className="c0"><span className="c9">Some states in the US or some countries do not allow the exclusion of implied
                                warranties or limitation of liability for incidental or consequential damages, which means that some of the
                                above limitations may not apply. In these US states &nbsp;or Countries, each party&#39;s liability will be
                                limited to the greatest extent permitted by law.</span></p>

                            <div id="as_is" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">&quot;AS IS&quot; and &quot;AS AVAILABLE&quot; Disclaimer</span></p>
                            <p className="c8"><span className="c9">The Service is provided to User &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; and
                                with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable
                                law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors
                                and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise,
                                with respect to the Service, including all implied warranties of merchantability, fitness for a particular
                                purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of
                                performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty
                                or undertaking, and makes no representation of any kind that the Service will meet User&rsquo;s
                                requirements, achieve any intended results, be compatible or work with any other software, applications,
                                systems or services, operate without interruption, meet any performance or reliability standards or be error
                                free or that any errors or defects can or will be corrected.</span></p>
                            <p className="c8"><span className="c9">Without limiting the foregoing, neither the Company nor any of the Company&#39;s
                                provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or
                                availability of the Service, or the information, content, and materials or products included thereon; (ii)
                                that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of
                                any information or content provided through the Service; or (iv) that the Service, its servers, the content,
                                or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms,
                                malware, timebombs or other harmful components.</span></p>
                            <p className="c0"><span className="c9">Some jurisdictions do not allow the exclusion of certain types of warranties or
                                limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and
                                limitations may not apply to User. But in such a case the exclusions and limitations set forth in this
                                section shall be applied to the greatest extent enforceable under applicable law.</span></p>
                            <p className=""><span className="c4 c5">Governing Law</span></p>
                            <p className="c0"><span className="c9">The laws of the Country, excluding its conflicts of law rules, shall govern this
                                Terms and Conditions and User&rsquo;s use of the Service. User&rsquo;s use of the Application may also be
                                subject to other local, state, national, or international laws.</span></p>
                            <p className="c0 c13"><span className="c4 c7 c11"></span></p>
                            <p className=""><span className="c4 c5">Disputes Resolution</span></p>
                            <p className="c0"><span className="c9">If User has any concern or dispute about the Service, User agrees to first try to
                                resolve the dispute informally and amicably by contacting the Company.</span></p>
                            <p className=""><span className="c4 c5">For European Union (EU) Users</span></p>
                            <p className="c0"><span className="c9">If User is an European Union consumer, User will benefit from any mandatory
                                provisions of the law of the country in which User is resident.</span></p>
                            <p className=""><span className="c4 c5">United States Federal Government End Use Provisions</span></p>
                            <p className="c0"><span className="c9">If User is an U.S. federal government end user, the Service is a &quot;Commercial
                                Item&quot; as that term is defined at 48 C.F.R. &sect;2.101.</span></p>
                            <p className=""><span className="c4 c5">United States Legal Compliance</span></p>
                            <p className="c0"><span className="c3">User represents and warrants that (i) User &nbsp;is not located in a country that is
                                subject to the United States government embargo, or that has been designated by the United States government
                                as a &quot;terrorist supporting&quot; country, and (ii) User is not listed on any United States government
                                list of prohibited or restricted parties.</span></p>
                            <p className="c0 c13"><span className="c2"></span></p>
                            <p className="c0 c13"><span className="c2"></span></p>

                            <div id="severability_and_waiver" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">Severability and Waiver</span></p>
                            <p className=""><span className="c4 c5">Severability</span></p>
                            <p className="c12"><span className="c9">If any provision of these Terms and Conditions is held to be unenforceable or
                                invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to
                                the greatest extent possible under applicable law and the remaining provisions will continue in full force
                                and effect.</span></p>
                            <p className=""><span className="c4 c5">Waiver</span></p>
                            <p className="c0"><span className="c9">Except as provided herein, the failure to exercise a right or to require performance
                                of an obligation under these Terms and Conditions shall not affect neither the User nor the Company&#39;s
                                ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a
                                breach constitute a waiver of any subsequent breach.</span></p>
                            <p className="c0 c13"><span className="c4 c11 c7"></span></p>
                            <p className=""><span className="c4 c5">Translation Interpretation</span></p>
                            <p className="c0"><span className="c9">These Terms and Conditions may have been translated if the Company has &nbsp;made
                                them available to User on the Service. User agrees that the original English text shall prevail in the case
                                of a dispute.</span></p>
                            <p className=""><span className="c4 c5">Changes</span><span className="c7 c20">&nbsp;</span><span className="c4 c5">to These
                                Terms and Conditions</span></p>
                            <p className="c8"><span className="c9">The Company reserves the right, at its sole discretion, to modify or replace these
                                Terms and Conditions at any time. If a revision is material the &nbsp;Company will make reasonable efforts
                                to provide at least 30 days&#39; notice prior to any new terms taking effect. What constitutes a material
                                change will be determined by the Company&rsquo;s at its sole discretion.</span></p>
                            <p className="c0"><span className="c9">By continuing to access or use the Service after those revisions become effective,
                                User agrees to be bound by the revised terms. If User does not agree to the new terms, in whole or in part,
                                User shall be at liberty to stop using the website and the Service.</span></p>
                            
                            <div id="contact" className="anchor"></div>
                            <p className="c0"><span className="c4 c7">Contact Us</span></p>
                            <p className="c8"><span className="c9">Anyone with any questions about these Terms and Conditions, can contact us:</span>
                            </p>
                            <ul className="c15 lst-kix_list_4-0 start">
                                <li className="c8 c10 li-bullet-0"><span className="c9">By email: </span><span className="c22">
                                    <a href={'mailto:info@rehomeafrica.com'} target="_blank" rel="noreferrer" style={{ color: "blue" }}>info@rehomeafrica.com</a>
                                </span>
                                </li>
                            </ul>
                        </div>
                    </Grid>

                    <Grid item xs={0} md={4}>
                        <div className="doc-table">
                            <p className="c0 c04"><span className='c4 c5'>Table of Content</span></p>
                            <ul className="c03">
                                <li><a href="#intepretations_and_definitions"><span className="c05">Interpretation and Definitions</span></a></li>
                                <li><a href="#acknowledgement"><span className="c05">Acknowledgment</span></a></li>
                                <li><a href="#subscriptions"><span className="c05">Subscriptions</span></a></li>
                                <li><a href="#in_app_purchases"><span className="c05">In-app Purchases</span></a></li>
                                <li><a href="#promotions"><span className="c05">Promotions</span></a></li>
                                <li><a href="#user_accounts"><span className="c05">User Accounts</span></a></li>
                                <li><a href="#content"><span className="c05">Content</span></a></li>
                                <li><a href="#copyright_policy"><span className="c05">Copyright Policy</span></a></li>
                                <li><a href="#limitation_of_liability"><span className="c05">Limitation of Liability</span></a></li>
                                <li><a href="#as_is"><span className="c05">AS IS and AS AVAILABLE Disclaimer</span></a></li>
                                <li><a href="#severability_and_waiver"><span className="c05">Severability and Waiver</span></a></li>
                                <li><a href="#contact"><span className="c05">Contact us</span></a></li>
                            </ul>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </motion.div>
    )
}

export default TermsCondition
