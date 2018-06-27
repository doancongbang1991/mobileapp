////////////////////////////////////////////////////////////
// GAME
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */
var countdown_arr = ['3','2','1','GO']; //game countdown text
var distanceDisplay = '[NUMBER]km'; //distance display, [NUMBER] will replace with number
var instructionDesktop = 'MOVE MOUSE LEFT/RIGHT TO BALANCE';
var instructionMobile = 'TILT DEVICE LEFT/RIGHT TO BALANCE';

var bottomRotateRange = 10; //player's bottom rotate range

var falldownUpdate = 50; //fall down timer update
var falldownPercent = 110; //fall down change with percent
var falldownPercentMobile = 100; //mobile fall down change with percent

var buildingStartPosY = 40; //building start y with percent
var buildingDistance = 500; //building distance

//Social share, [SCORE] will replace with game score
var shareTitle = 'Highscore on Skywire is [SCORE]';//social share score title
var shareMessage = '[SCORE] is mine new highscore on Skywire! Try it now!'; //social share score message

/*!
 *
 * GAME BUTTONS CUSTOMIZATION END
 *
 */
 
var data_arr = [{mcHeadX:397.55, mcHeadY:423.9, mcHeadRotate:0, mcBodyX:394.95, mcBodyY:635.95, mcBodyRotate:0, mcPantX:387.4, mcPantY:633.8, mcPantRotate:0, mcHandLX:181.2, mcHandLY:507.85, mcHandLRotate:0, mcHandL1X:350.2, mcHandL1Y:470.4, mcHandL1Rotate:44.99913024902344, mcHandL2X:266.6, mcHandL2Y:518, mcHandL2Rotate:120.00053405761719, mcHandRX:616.2, mcHandRY:507.85, mcHandRRotate:0, mcHandR1X:446.95, mcHandR1Y:470.4, mcHandR1Rotate:-44.99913024902344, mcHandR2X:530.6, mcHandR2Y:518, mcHandR2Rotate:-120.00053405761719, },
{mcHeadX:408.45, mcHeadY:425.85, mcHeadRotate:0.55426025390625, mcBodyX:394.2, mcBodyY:636.65, mcBodyRotate:3.0509185791015625, mcPantX:386.4, mcPantY:633.8, mcPantRotate:-0.302490234375, mcHandLX:189.6, mcHandLY:513.35, mcHandLRotate:-1.78729248046875, mcHandL1X:358.25, mcHandL1Y:471.65, mcHandL1Rotate:43.86399841308594, mcHandL2X:275.85, mcHandL2Y:520.85, mcHandL2Rotate:118.81900024414063, mcHandRX:620.4, mcHandRY:504.25, mcHandRRotate:-5.76806640625, mcHandR1X:453.4, mcHandR1Y:476.8, mcHandR1Rotate:-48.6058349609375, mcHandR2X:537.6, mcHandR2Y:518.6, mcHandR2Rotate:-123.55813598632813, },
{mcHeadX:419.25, mcHeadY:427.75, mcHeadRotate:1.29718017578125, mcBodyX:393.5, mcBodyY:637.3, mcBodyRotate:6.292022705078125, mcPantX:385.4, mcPantY:633.8, mcPantRotate:-0.7920379638671875, mcHandLX:197.95, mcHandLY:518.85, mcHandLRotate:-3.762664794921875, mcHandL1X:366.3, mcHandL1Y:473, mcHandL1Rotate:42.63490295410156, mcHandL2X:285.1, mcHandL2Y:523.75, mcHandL2Rotate:117.59011840820313, mcHandRX:624.65, mcHandRY:500.7, mcHandRRotate:-11.537399291992188, mcHandR1X:459.75, mcHandR1Y:483.15, mcHandR1Rotate:-52.11717224121094, mcHandR2X:544.7, mcHandR2Y:519.3, mcHandR2Rotate:-127.06962585449219, },
{mcHeadX:430.05, mcHeadY:429.65, mcHeadRotate:2.0388031005859375, mcBodyX:392.75, mcBodyY:638, mcBodyRotate:9.534042358398438, mcPantX:384.4, mcPantY:633.8, mcPantRotate:-1.283203125, mcHandLX:206.35, mcHandLY:524.4, mcHandLRotate:-5.552490234375, mcHandL1X:374.4, mcHandL1Y:474.4, mcHandL1Rotate:41.59429931640625, mcHandL2X:294.35, mcHandL2Y:526.55, mcHandL2Rotate:116.54966735839844, mcHandRX:628.85, mcHandRY:497.1, mcHandRRotate:-17.313400268554688, mcHandR1X:466.15, mcHandR1Y:489.55, mcHandR1Rotate:-55.629425048828125, mcHandR2X:551.75, mcHandR2Y:519.95, mcHandR2Rotate:-130.5816650390625, },
{mcHeadX:440.9, mcHeadY:431.55, mcHeadRotate:2.7805938720703125, mcBodyX:392, mcBodyY:638.7, mcBodyRotate:12.775543212890625, mcPantX:383.4, mcPantY:633.8, mcPantRotate:-1.771575927734375, mcHandLX:214.75, mcHandLY:529.9, mcHandLRotate:-7.52838134765625, mcHandL1X:382.5, mcHandL1Y:475.7, mcHandL1Rotate:40.36412048339844, mcHandL2X:303.55, mcHandL2Y:529.45, mcHandL2Rotate:115.31948852539063, mcHandRX:633.05, mcHandRY:493.55, mcHandRRotate:-23.09002685546875, mcHandR1X:472.5, mcHandR1Y:495.9, mcHandR1Rotate:-59.13957214355469, mcHandR2X:558.9, mcHandR2Y:520.7, mcHandR2Rotate:-134.09487915039063, },
{mcHeadX:451.7, mcHeadY:433.5, mcHeadRotate:3.5232086181640625, mcBodyX:391.3, mcBodyY:639.35, mcBodyRotate:16.02008056640625, mcPantX:382.4, mcPantY:633.85, mcPantRotate:-2.2631683349609375, mcHandLX:223.1, mcHandLY:535.4, mcHandLRotate:-9.316238403320313, mcHandL1X:390.55, mcHandL1Y:477, mcHandL1Rotate:39.13531494140625, mcHandL2X:312.75, mcHandL2Y:532.3, mcHandL2Rotate:114.09367370605469, mcHandRX:637.3, mcHandRY:489.95, mcHandRRotate:-29.057357788085938, mcHandR1X:478.9, mcHandR1Y:502.2, mcHandR1Rotate:-62.649383544921875, mcHandR2X:565.95, mcHandR2Y:521.3, mcHandR2Rotate:-137.60595703125, },
{mcHeadX:462.5, mcHeadY:435.45, mcHeadRotate:4.3107147216796875, mcBodyX:390.55, mcBodyY:640.05, mcBodyRotate:19.076675415039063, mcPantX:381.4, mcPantY:633.85, mcPantRotate:-2.7518157958984375, mcHandLX:231.5, mcHandLY:540.9, mcHandLRotate:-11.294631958007813, mcHandL1X:398.65, mcHandL1Y:478.3, mcHandL1Rotate:38.0946044921875, mcHandL2X:322.05, mcHandL2Y:535.15, mcHandL2Rotate:113.05302429199219, mcHandRX:641.5, mcHandRY:486.35, mcHandRRotate:-34.83966064453125, mcHandR1X:485.3, mcHandR1Y:508.6, mcHandR1Rotate:-66.16036987304688, mcHandR2X:572.95, mcHandR2Y:522.05, mcHandR2Rotate:-141.11805725097656, },
{mcHeadX:470.85, mcHeadY:443.6, mcHeadRotate:5.022857666015625, mcBodyX:389.8, mcBodyY:640.75, mcBodyRotate:22.322235107421875, mcPantX:380.4, mcPantY:633.8, mcPantRotate:-3.05352783203125, mcHandLX:239.9, mcHandLY:546.5, mcHandLRotate:-13.271804809570313, mcHandL1X:406.65, mcHandL1Y:479.7, mcHandL1Rotate:36.86592102050781, mcHandL2X:331.25, mcHandL2Y:538.1, mcHandL2Rotate:111.82521057128906, mcHandRX:645.7, mcHandRY:482.8, mcHandRRotate:-40.62249755859375, mcHandR1X:491.65, mcHandR1Y:515, mcHandR1Rotate:-69.66732788085938, mcHandR2X:580.05, mcHandR2Y:522.65, mcHandR2Rotate:-144.63023376464844, },
{mcHeadX:479.2, mcHeadY:451.7, mcHeadRotate:5.7793121337890625, mcBodyX:389.05, mcBodyY:641.45, mcBodyRotate:25.569000244140625, mcPantX:379.4, mcPantY:633.8, mcPantRotate:-3.54498291015625, mcHandLX:248.3, mcHandLY:551.95, mcHandLRotate:-15.060089111328125, mcHandL1X:414.75, mcHandL1Y:480.95, mcHandL1Rotate:35.82524108886719, mcHandL2X:340.45, mcHandL2Y:540.9, mcHandL2Rotate:110.78564453125, mcHandRX:649.9, mcHandRY:479.2, mcHandRRotate:-46.407196044921875, mcHandR1X:498.05, mcHandR1Y:521.3, mcHandR1Rotate:-73.17555236816406, mcHandR2X:587.05, mcHandR2Y:523.35, mcHandR2Rotate:-148.1406707763672, },
{mcHeadX:487.5, mcHeadY:459.85, mcHeadRotate:6.5354766845703125, mcBodyX:388.35, mcBodyY:642.1, mcBodyRotate:28.815643310546875, mcPantX:378.4, mcPantY:633.8, mcPantRotate:-4.0350341796875, mcHandLX:256.65, mcHandLY:557.45, mcHandLRotate:-17.040481567382813, mcHandL1X:422.85, mcHandL1Y:482.25, mcHandL1Rotate:34.595703125, mcHandL2X:349.75, mcHandL2Y:543.7, mcHandL2Rotate:109.55551147460938, mcHandRX:654.15, mcHandRY:475.6, mcHandRRotate:-52.37841796875, mcHandR1X:504.45, mcHandR1Y:527.65, mcHandR1Rotate:-76.68182373046875, mcHandR2X:594.15, mcHandR2Y:524, mcHandR2Rotate:-151.65087890625, },
{mcHeadX:495.9, mcHeadY:468, mcHeadRotate:7.292816162109375, mcBodyX:387.6, mcBodyY:642.8, mcBodyRotate:32.06321716308594, mcPantX:377.4, mcPantY:633.85, mcPantRotate:-4.52276611328125, mcHandLX:265.05, mcHandLY:562.95, mcHandLRotate:-18.829544067382813, mcHandL1X:430.95, mcHandL1Y:483.6, mcHandL1Rotate:33.367095947265625, mcHandL2X:358.9, mcHandL2Y:546.6, mcHandL2Rotate:108.32997131347656, mcHandRX:658.35, mcHandRY:472.05, mcHandRRotate:-58.160858154296875, mcHandR1X:510.8, mcHandR1Y:534.05, mcHandR1Rotate:-80.18644714355469, mcHandR2X:601.25, mcHandR2Y:524.7, mcHandR2Rotate:-155.16102600097656, },
{mcHeadX:504.25, mcHeadY:476.1, mcHeadRotate:8.048446655273438, mcBodyX:386.9, mcBodyY:643.5, mcBodyRotate:35.124298095703125, mcPantX:376.4, mcPantY:633.8, mcPantRotate:-5.015045166015625, mcHandLX:273.45, mcHandLY:568.5, mcHandLRotate:-20.808563232421875, mcHandL1X:439, mcHandL1Y:484.95, mcHandL1Rotate:32.32679748535156, mcHandL2X:368.1, mcHandL2Y:549.45, mcHandL2Rotate:107.28948974609375, mcHandRX:662.55, mcHandRY:468.45, mcHandRRotate:-63.94285583496094, mcHandR1X:517.2, mcHandR1Y:540.4, mcHandR1Rotate:-83.69070434570313, mcHandR2X:608.25, mcHandR2Y:525.4, mcHandR2Rotate:-158.66921997070313, },
{mcHeadX:512.6, mcHeadY:484.2, mcHeadRotate:8.8055419921875, mcBodyX:386.15, mcBodyY:644.1, mcBodyRotate:38.37294006347656, mcPantX:375.4, mcPantY:633.8, mcPantRotate:-5.50311279296875, mcHandLX:281.8, mcHandLY:574, mcHandLRotate:-22.787506103515625, mcHandL1X:447.1, mcHandL1Y:486.25, mcHandL1Rotate:31.097564697265625, mcHandL2X:377.35, mcHandL2Y:552.35, mcHandL2Rotate:106.06207275390625, mcHandRX:666.8, mcHandRY:464.9, mcHandRRotate:-69.72116088867188, mcHandR1X:523.6, mcHandR1Y:546.75, mcHandR1Rotate:-87.19410705566406, mcHandR2X:615.35, mcHandR2Y:526.1, mcHandR2Rotate:-162.1780548095703, },
{mcHeadX:520.95, mcHeadY:492.35, mcHeadRotate:9.725250244140625, mcBodyX:385.4, mcBodyY:644.85, mcBodyRotate:41.656829833984375, mcPantX:374.4, mcPantY:633.8, mcPantRotate:-5.9661712646484375, mcHandLX:290.2, mcHandLY:579.5, mcHandLRotate:-24.68902587890625, mcHandL1X:455.15, mcHandL1Y:487.55, mcHandL1Rotate:30.035919189453125, mcHandL2X:386.6, mcHandL2Y:555.2, mcHandL2Rotate:105.03726196289063, mcHandRX:671, mcHandRY:461.3, mcHandRRotate:-75.5325927734375, mcHandR1X:529.95, mcHandR1Y:553.1, mcHandR1Rotate:-90.53153991699219, mcHandR2X:622.45, mcHandR2Y:526.75, mcHandR2Rotate:-165.5325927734375, },
{mcHeadX:534.2, mcHeadY:535.05, mcHeadRotate:22.288558959960938, mcBodyX:381.5, mcBodyY:647.7, mcBodyRotate:54.179931640625, mcPantX:374.35, mcPantY:633.8, mcPantRotate:-5.805267333984375, mcHandLX:316.55, mcHandLY:562.65, mcHandLRotate:-6.0561065673828125, mcHandL1X:474.85, mcHandL1Y:519.45, mcHandL1Rotate:46.116912841796875, mcHandL2X:400.85, mcHandL2Y:562.25, mcHandL2Rotate:121.07191467285156, mcHandRX:676.7, mcHandRY:535.6, mcHandRRotate:-62.952301025390625, mcHandR1X:530.65, mcHandR1Y:591.95, mcHandR1Rotate:-77.98419189453125, mcHandR2X:619.85, mcHandR2Y:585.8, mcHandR2Rotate:-152.95230102539063, },
{mcHeadX:547.3, mcHeadY:577.65, mcHeadRotate:34.83966064453125, mcBodyX:377.6, mcBodyY:650.55, mcBodyRotate:66.92033386230469, mcPantX:374.35, mcPantY:633.8, mcPantRotate:-5.805267333984375, mcHandLX:342.8, mcHandLY:545.7, mcHandLRotate:12.262313842773438, mcHandL1X:494.6, mcHandL1Y:551.45, mcHandL1Rotate:62.178253173828125, mcHandL2X:415.05, mcHandL2Y:569.2, mcHandL2Rotate:137.13265991210938, mcHandRX:682.35, mcHandRY:609.9, mcHandRRotate:-50.397064208984375, mcHandR1X:531.4, mcHandR1Y:630.85, mcHandR1Rotate:-65.44245910644531, mcHandR2X:617.2, mcHandR2Y:644.8, mcHandR2Rotate:-140.39706420898438, },
{mcHeadX:560.45, mcHeadY:620.35, mcHeadRotate:47.39776611328125, mcBodyX:373.75, mcBodyY:653.35, mcBodyRotate:79.45974731445313, mcPantX:374.35, mcPantY:633.8, mcPantRotate:-5.805267333984375, mcHandLX:369.15, mcHandLY:528.85, mcHandLRotate:30.607864379882813, mcHandL1X:514.45, mcHandL1Y:583.35, mcHandL1Rotate:78.2227783203125, mcHandL2X:429.3, mcHandL2Y:576.15, mcHandL2Rotate:153.19137573242188, mcHandRX:687.95, mcHandRY:684.2, mcHandRRotate:-37.8392333984375, mcHandR1X:532.1, mcHandR1Y:669.7, mcHandR1Rotate:-52.8897705078125, mcHandR2X:614.65, mcHandR2Y:703.85, mcHandR2Rotate:-127.84031677246094, },
{mcHeadX:573.7, mcHeadY:662.95, mcHeadRotate:59.99946594238281, mcBodyX:369.85, mcBodyY:656.15, mcBodyRotate:91.931396484375, mcPantX:374.4, mcPantY:633.8, mcPantRotate:-5.9661712646484375, mcHandLX:395.45, mcHandLY:511.9, mcHandLRotate:49.21470642089844, mcHandL1X:534.2, mcHandL1Y:615.35, mcHandL1Rotate:94.21333312988281, mcHandL2X:443.5, mcHandL2Y:583.15, mcHandL2Rotate:169.2157440185547, mcHandRX:693.55, mcHandRY:758.5, mcHandRRotate:-25.25872802734375, mcHandR1X:532.8, mcHandR1Y:708.65, mcHandR1Rotate:-40.25634765625, mcHandR2X:612.15, mcHandR2Y:762.9, mcHandR2Rotate:-115.25872802734375, },
{mcHeadX:599.8, mcHeadY:769.95, mcHeadRotate:78.74151611328125, mcBodyX:435.3, mcBodyY:715.2, mcBodyRotate:110.56983947753906, mcPantX:444.5, mcPantY:698.05, mcPantRotate:12.767227172851563, mcHandLX:557.55, mcHandLY:598.4, mcHandLRotate:93.04481506347656, mcHandL1X:575, mcHandL1Y:717.75, mcHandL1Rotate:138.13446044921875, mcHandL2X:546.25, mcHandL2Y:659.55, mcHandL2Rotate:-146.89222717285156, mcHandRX:674.4, mcHandRY:876.8, mcHandRRotate:-6.5035552978515625, mcHandR1X:555.4, mcHandR1Y:797.35, mcHandR1Rotate:-21.527755737304688, mcHandR2X:606.95, mcHandR2Y:860.75, mcHandR2Rotate:-96.50527954101563, },
{mcHeadX:625.9, mcHeadY:876.95, mcHeadRotate:97.31346130371094, mcBodyX:500.85, mcBodyY:774.25, mcBodyRotate:129.3722686767578, mcPantX:514.55, mcPantY:762.4, mcPantRotate:31.560043334960938, mcHandLX:719.6, mcHandLY:685, mcHandLRotate:137.12608337402344, mcHandL1X:615.9, mcHandL1Y:820.25, mcHandL1Rotate:-177.97254943847656, mcHandL2X:648.95, mcHandL2Y:735.9, mcHandL2Rotate:-102.79466247558594, mcHandRX:655.2, mcHandRY:994.95, mcHandRRotate:12.067642211914063, mcHandR1X:578.1, mcHandR1Y:885.95, mcHandR1Rotate:-2.7535552978515625, mcHandR2X:601.85, mcHandR2Y:958.45, mcHandR2Rotate:-77.93235778808594, },
{mcHeadX:652, mcHeadY:984.05, mcHeadRotate:116.09805297851563, mcBodyX:566.35, mcBodyY:833.2, mcBodyRotate:148.1816864013672, mcPantX:584.6, mcPantY:826.6, mcPantRotate:50.36956787109375, mcHandLX:781.65, mcHandLY:901.7, mcHandLRotate:-178.9842071533203, mcHandL1X:656.8, mcHandL1Y:922.75, mcHandL1Rotate:-133.90078735351563, mcHandL2X:719.65, mcHandL2Y:893.3, mcHandL2Rotate:-58.92488098144531, mcHandRX:636.05, mcHandRY:1113.25, mcHandRRotate:30.860427856445313, mcHandR1X:600.7, mcHandR1Y:974.75, mcHandR1Rotate:15.824432373046875, mcHandR2X:596.65, mcHandR2Y:1056.2, mcHandR2Rotate:-59.14215087890625, },
{mcHeadX:678.15, mcHeadY:1091, mcHeadRotate:134.99913024902344, mcBodyX:631.9, mcBodyY:892.3, mcBodyRotate:166.9312744140625, mcPantX:654.7, mcPantY:890.95, mcPantRotate:69.03424072265625, mcHandLX:843.65, mcHandLY:1118.25, mcHandLRotate:-135.00131225585938, mcHandL1X:697.65, mcHandL1Y:1025.3, mcHandL1Rotate:-90.00175476074219, mcHandL2X:790.45, mcHandL2Y:1050.7, mcHandL2Rotate:-15.00054931640625, mcHandRX:616.85, mcHandRY:1231.45, mcHandRRotate:49.74212646484375, mcHandR1X:623.4, mcHandR1Y:1063.3, mcHandR1Rotate:34.742950439453125, mcHandR2X:591.55, mcHandR2Y:1154, mcHandR2Rotate:-40.2593994140625, },
{mcHeadX:397.55, mcHeadY:423.9, mcHeadRotate:0, mcBodyX:394.95, mcBodyY:635.95, mcBodyRotate:0, mcPantX:387.4, mcPantY:633.8, mcPantRotate:0, mcHandLX:181.2, mcHandLY:507.85, mcHandLRotate:0, mcHandL1X:350.2, mcHandL1Y:470.4, mcHandL1Rotate:44.99913024902344, mcHandL2X:266.6, mcHandL2Y:518, mcHandL2Rotate:120.00053405761719, mcHandRX:616.2, mcHandRY:507.85, mcHandRRotate:0, mcHandR1X:446.95, mcHandR1Y:470.4, mcHandR1Rotate:-45, mcHandR2X:530.6, mcHandR2Y:518, mcHandR2Rotate:-120.00053405761719, },
{mcHeadX:385.35, mcHeadY:425.55, mcHeadRotate:-0.5385284423828125, mcBodyX:393.9, mcBodyY:635.7, mcBodyRotate:-3.0465545654296875, mcPantX:388, mcPantY:633.75, mcPantRotate:0.2989959716796875, mcHandLX:175.1, mcHandLY:503.05, mcHandLRotate:3.53887939453125, mcHandL1X:342.05, mcHandL1Y:476.15, mcHandL1Rotate:48.64326477050781, mcHandL2X:257.8, mcHandL2Y:517.8, mcHandL2Rotate:123.59637451171875, mcHandRX:605.9, mcHandRY:510.45, mcHandRRotate:0.514923095703125, mcHandR1X:437.15, mcHandR1Y:471.4, mcHandR1Rotate:-44.39009094238281, mcHandR2X:520.2, mcHandR2Y:519.7, mcHandR2Rotate:-119.34315490722656, },
{mcHeadX:373.1, mcHeadY:427.25, mcHeadRotate:-1.2631072998046875, mcBodyX:392.75, mcBodyY:635.55, mcBodyRotate:-6.2799224853515625, mcPantX:388.6, mcPantY:633.8, mcPantRotate:0.785919189453125, mcHandLX:169.05, mcHandLY:498.3, mcHandLRotate:7.2678680419921875, mcHandL1X:333.8, mcHandL1Y:481.85, mcHandL1Rotate:52.38116455078125, mcHandL2X:249, mcHandL2Y:517.6, mcHandL2Rotate:127.33251953125, mcHandRX:595.65, mcHandRY:513.05, mcHandRRotate:1.028900146484375, mcHandR1X:427.25, mcHandR1Y:472.4, mcHandR1Rotate:-43.87353515625, mcHandR2X:509.95, mcHandR2Y:521.5, mcHandR2Rotate:-118.82704162597656, },
{mcHeadX:360.8, mcHeadY:428.85, mcHeadRotate:-1.8021392822265625, mcBodyX:391.65, mcBodyY:635.4, mcBodyRotate:-9.515335083007813, mcPantX:389.2, mcPantY:633.8, mcPantRotate:1.2718505859375, mcHandLX:162.95, mcHandLY:493.5, mcHandLRotate:10.8095703125, mcHandL1X:325.7, mcHandL1Y:487.55, mcHandL1Rotate:55.93009948730469, mcHandL2X:240.3, mcHandL2Y:517.45, mcHandL2Rotate:130.88238525390625, mcHandRX:585.35, mcHandRY:515.7, mcHandRRotate:1.5444488525390625, mcHandR1X:417.5, mcHandR1Y:473.4, mcHandR1Rotate:-43.35707092285156, mcHandR2X:499.55, mcHandR2Y:523.25, mcHandR2Rotate:-118.31118774414063, },
{mcHeadX:348.5, mcHeadY:430.55, mcHeadRotate:-2.5258636474609375, mcBodyX:390.6, mcBodyY:635.2, mcBodyRotate:-12.561660766601563, mcPantX:389.8, mcPantY:633.75, mcPantRotate:1.7602081298828125, mcHandLX:156.9, mcHandLY:488.75, mcHandLRotate:14.54034423828125, mcHandL1X:317.5, mcHandL1Y:493.35, mcHandL1Rotate:59.666839599609375, mcHandL2X:231.45, mcHandL2Y:517.3, mcHandL2Rotate:134.62127685546875, mcHandRX:575.05, mcHandRY:518.3, mcHandRRotate:2.0588836669921875, mcHandR1X:407.7, mcHandR1Y:474.4, mcHandR1Rotate:-42.83961486816406, mcHandR2X:489.25, mcHandR2Y:525.05, mcHandR2Rotate:-117.79507446289063, },
{mcHeadX:336.25, mcHeadY:432.15, mcHeadRotate:-3.2531280517578125, mcBodyX:389.55, mcBodyY:634.95, mcBodyRotate:-15.799331665039063, mcPantX:390.4, mcPantY:633.85, mcPantRotate:2.0588836669921875, mcHandLX:150.8, mcHandLY:483.95, mcHandLRotate:18.272445678710938, mcHandL1X:309.35, mcHandL1Y:499.1, mcHandL1Rotate:63.40419006347656, mcHandL2X:222.65, mcHandL2Y:517.1, mcHandL2Rotate:138.35830688476563, mcHandRX:564.8, mcHandRY:520.9, mcHandRRotate:2.76141357421875, mcHandR1X:397.85, mcHandR1Y:475.35, mcHandR1Rotate:-42.13642883300781, mcHandR2X:479, mcHandR2Y:526.85, mcHandR2Rotate:-117.08998107910156, },
{mcHeadX:324, mcHeadY:433.85, mcHeadRotate:-3.7913818359375, mcBodyX:388.4, mcBodyY:634.8, mcBodyRotate:-19.037612915039063, mcPantX:391, mcPantY:633.85, mcPantRotate:2.545928955078125, mcHandLX:144.7, mcHandLY:479.15, mcHandLRotate:21.818435668945313, mcHandL1X:301.1, mcHandL1Y:504.8, mcHandL1Rotate:66.94993591308594, mcHandL2X:213.9, mcHandL2Y:516.85, mcHandL2Rotate:141.9086456298828, mcHandRX:554.5, mcHandRY:523.5, mcHandRRotate:3.2766571044921875, mcHandR1X:388, mcHandR1Y:476.35, mcHandR1Rotate:-41.620208740234375, mcHandR2X:468.6, mcHandR2Y:528.6, mcHandR2Rotate:-116.57484436035156, },
{mcHeadX:311.75, mcHeadY:435.55, mcHeadRotate:-4.557525634765625, mcBodyX:387.4, mcBodyY:634.55, mcBodyRotate:-22.088424682617188, mcPantX:391.6, mcPantY:633.8, mcPantRotate:3.03173828125, mcHandLX:138.65, mcHandLY:474.4, mcHandLRotate:25.554046630859375, mcHandL1X:292.95, mcHandL1Y:510.55, mcHandL1Rotate:70.68472290039063, mcHandL2X:205.1, mcHandL2Y:516.7, mcHandL2Rotate:145.6472930908203, mcHandRX:544.2, mcHandRY:526.15, mcHandRRotate:3.7913818359375, mcHandR1X:378.3, mcHandR1Y:477.35, mcHandR1Rotate:-41.10404968261719, mcHandR2X:458.3, mcHandR2Y:530.4, mcHandR2Rotate:-116.05856323242188, },
{mcHeadX:300.7, mcHeadY:442.9, mcHeadRotate:-5.2847442626953125, mcBodyX:386.3, mcBodyY:634.45, mcBodyRotate:-25.329483032226563, mcPantX:392.2, mcPantY:633.75, mcPantRotate:3.51885986328125, mcHandLX:132.55, mcHandLY:469.6, mcHandLRotate:29.10076904296875, mcHandL1X:284.85, mcHandL1Y:516.25, mcHandL1Rotate:74.22900390625, mcHandL2X:196.35, mcHandL2Y:516.5, mcHandL2Rotate:149.19436645507813, mcHandRX:533.9, mcHandRY:528.75, mcHandRRotate:4.3054962158203125, mcHandR1X:368.45, mcHandR1Y:478.4, mcHandR1Rotate:-40.58721923828125, mcHandR2X:447.95, mcHandR2Y:532.15, mcHandR2Rotate:-115.54266357421875, },
{mcHeadX:289.8, mcHeadY:450.15, mcHeadRotate:-6.052642822265625, mcBodyX:385.15, mcBodyY:634.2, mcBodyRotate:-28.570770263671875, mcPantX:392.8, mcPantY:633.8, mcPantRotate:4.0063323974609375, mcHandLX:126.45, mcHandLY:464.8, mcHandLRotate:32.8370361328125, mcHandL1X:276.7, mcHandL1Y:522.05, mcHandL1Rotate:77.96078491210938, mcHandL2X:187.55, mcHandL2Y:516.35, mcHandL2Rotate:152.9322052001953, mcHandRX:523.65, mcHandRY:531.35, mcHandRRotate:5.00897216796875, mcHandR1X:358.65, mcHandR1Y:479.3, mcHandR1Rotate:-39.88360595703125, mcHandR2X:437.6, mcHandR2Y:533.85, mcHandR2Rotate:-114.83897399902344, },
{mcHeadX:278.85, mcHeadY:457.45, mcHeadRotate:-7.007049560546875, mcBodyX:384.05, mcBodyY:634.05, mcBodyRotate:-31.811370849609375, mcPantX:393.4, mcPantY:633.8, mcPantRotate:4.30462646484375, mcHandLX:120.4, mcHandLY:460.05, mcHandLRotate:36.57496643066406, mcHandL1X:268.4, mcHandL1Y:527.75, mcHandL1Rotate:81.691162109375, mcHandL2X:178.7, mcHandL2Y:516.1, mcHandL2Rotate:156.66702270507813, mcHandRX:513.35, mcHandRY:533.95, mcHandRRotate:5.5239105224609375, mcHandR1X:348.75, mcHandR1Y:480.25, mcHandR1Rotate:-39.365997314453125, mcHandR2X:427.25, mcHandR2Y:535.65, mcHandR2Rotate:-114.32276916503906, },
{mcHeadX:267.85, mcHeadY:464.7, mcHeadRotate:-7.77398681640625, mcBodyX:383, mcBodyY:633.9, mcBodyRotate:-34.86497497558594, mcPantX:394, mcPantY:633.85, mcPantRotate:4.7911376953125, mcHandLX:114.3, mcHandLY:455.25, mcHandLRotate:40.12420654296875, mcHandL1X:260.35, mcHandL1Y:533.5, mcHandL1Rotate:85.2322998046875, mcHandL2X:170, mcHandL2Y:515.95, mcHandL2Rotate:160.21192932128906, mcHandRX:503.05, mcHandRY:536.6, mcHandRRotate:6.038818359375, mcHandR1X:339, mcHandR1Y:481.35, mcHandR1Rotate:-38.85066223144531, mcHandR2X:417, mcHandR2Y:537.4, mcHandR2Rotate:-113.80671691894531, },
{mcHeadX:256.85, mcHeadY:472, mcHeadRotate:-8.539825439453125, mcBodyX:381.9, mcBodyY:633.7, mcBodyRotate:-38.10652160644531, mcPantX:394.6, mcPantY:633.8, mcPantRotate:5.2795562744140625, mcHandLX:108.25, mcHandLY:450.5, mcHandLRotate:43.862640380859375, mcHandL1X:252.1, mcHandL1Y:539.3, mcHandL1Rotate:88.95974731445313, mcHandL2X:161.2, mcHandL2Y:515.8, mcHandL2Rotate:163.94439697265625, mcHandRX:492.8, mcHandRY:539.2, mcHandRRotate:6.5536041259765625, mcHandR1X:329.15, mcHandR1Y:482.25, mcHandR1Rotate:-38.33314514160156, mcHandR2X:406.6, mcHandR2Y:539.2, mcHandR2Rotate:-113.29168701171875, },
{mcHeadX:245.9, mcHeadY:479.25, mcHeadRotate:-9.459197998046875, mcBodyX:380.8, mcBodyY:633.5, mcBodyRotate:-41.321746826171875, mcPantX:395.2, mcPantY:633.8, mcPantRotate:5.8061370849609375, mcHandLX:102.15, mcHandLY:445.7, mcHandLRotate:47.49266052246094, mcHandL1X:243.95, mcHandL1Y:545, mcHandL1Rotate:92.49095153808594, mcHandL2X:152.35, mcHandL2Y:515.55, mcHandL2Rotate:167.49331665039063, mcHandRX:482.5, mcHandRY:541.8, mcHandRRotate:7.2635650634765625, mcHandR1X:319.35, mcHandR1Y:483.2, mcHandR1Rotate:-37.73603820800781, mcHandR2X:396.3, mcHandR2Y:541, mcHandR2Rotate:-112.73770141601563, },
{mcHeadX:236, mcHeadY:519.55, mcHeadRotate:-25.809677124023438, mcBodyX:387.3, mcBodyY:635.05, mcBodyRotate:-53.66993713378906, mcPantX:394.25, mcPantY:633.8, mcPantRotate:5.010711669921875, mcHandLX:90.6, mcHandLY:485.45, mcHandLRotate:47.412933349609375, mcHandL1X:232.45, mcHandL1Y:584.65, mcHandL1Rotate:92.31204223632813, mcHandL2X:140.9, mcHandL2Y:555.2, mcHandL2Rotate:167.489990234375, mcHandRX:456.75, mcHandRY:518.2, mcHandRRotate:-8.764556884765625, mcHandR1X:293.8, mcHandR1Y:508.05, mcHandR1Rotate:-53.897552490234375, mcHandR2X:380, mcHandR2Y:540, mcHandR2Rotate:-128.84429931640625, },
{mcHeadX:226.15, mcHeadY:560, mcHeadRotate:-42.14170837402344, mcBodyX:393.75, mcBodyY:636.65, mcBodyRotate:-66.17207336425781, mcPantX:393.25, mcPantY:633.75, mcPantRotate:4.2628936767578125, mcHandLX:79.1, mcHandLY:525.05, mcHandLRotate:47.49266052246094, mcHandL1X:220.9, mcHandL1Y:624.35, mcHandL1Rotate:92.49095153808594, mcHandL2X:129.3, mcHandL2Y:594.9, mcHandL2Rotate:167.49331665039063, mcHandRX:431.1, mcHandRY:494.7, mcHandRRotate:-24.844009399414063, mcHandR1X:268.35, mcHandR1Y:532.8, mcHandR1Rotate:-69.96307373046875, mcHandR2X:363.55, mcHandR2Y:539.05, mcHandR2Rotate:-144.91725158691406, },
{mcHeadX:216.25, mcHeadY:600.35, mcHeadRotate:-58.66648864746094, mcBodyX:400.1, mcBodyY:638.35, mcBodyRotate:-78.47518920898438, mcPantX:392.25, mcPantY:633.8, mcPantRotate:3.507537841796875, mcHandLX:81.65, mcHandLY:620.5, mcHandLRotate:23.591934204101563, mcHandL1X:237.05, mcHandL1Y:651.4, mcHandL1Rotate:68.724609375, mcHandL2X:149.45, mcHandL2Y:660.5, mcHandL2Rotate:143.68299865722656, mcHandRX:391.95, mcHandRY:473, mcHandRRotate:-45.85601806640625, mcHandR1X:260.3, mcHandR1Y:561.5, mcHandR1Rotate:-90.75706481933594, mcHandR2X:345.85, mcHandR2Y:536.1, mcHandR2Rotate:-165.73605346679688, },
{mcHeadX:206.35, mcHeadY:640.7, mcHeadRotate:-75.00025939941406, mcBodyX:406.55, mcBodyY:639.9, mcBodyRotate:-90.80863952636719, mcPantX:391.25, mcPantY:633.8, mcPantRotate:2.7893218994140625, mcHandLX:84.2, mcHandLY:715.9, mcHandLRotate:0, mcHandL1X:253.2, mcHandL1Y:678.45, mcHandL1Rotate:44.99913024902344, mcHandL2X:169.6, mcHandL2Y:726.05, mcHandL2Rotate:120.00053405761719, mcHandRX:352.65, mcHandRY:451.25, mcHandRRotate:-66.7178955078125, mcHandR1X:252.25, mcHandR1Y:590.25, mcHandR1Rotate:-111.60110473632813, mcHandR2X:328.25, mcHandR2Y:533.05, mcHandR2Rotate:173.44122314453125, },
{mcHeadX:184.05, mcHeadY:742.55, mcHeadRotate:-90, mcBodyX:359.05, mcBodyY:698.45, mcBodyRotate:-105.7799072265625, mcPantX:344.45, mcPantY:696.45, mcPantRotate:-12.061798095703125, mcHandLX:91, mcHandLY:851.1, mcHandLRotate:-7.2953948974609375, mcHandL1X:236.1, mcHandL1Y:770.55, mcHandL1Rotate:37.3629150390625, mcHandL2X:161.25, mcHandL2Y:827.9, mcHandL2Rotate:94.00894165039063, mcHandRX:271.1, mcHandRY:545.1, mcHandRRotate:-81.73910522460938, mcHandR1X:213.35, mcHandR1Y:688.45, mcHandR1Rotate:-126.59300231933594, mcHandR2X:267.4, mcHandR2Y:621.9, mcHandR2Rotate:158.45863342285156, },
{mcHeadX:161.8, mcHeadY:844.3, mcHeadRotate:-104.82585144042969, mcBodyX:311.6, mcBodyY:757.05, mcBodyRotate:-120.81596374511719, mcPantX:297.5, mcPantY:759, mcPantRotate:-27.089981079101563, mcHandLX:97.75, mcHandLY:986.25, mcHandLRotate:-14.82421875, mcHandL1X:219, mcHandL1Y:862.4, mcHandL1Rotate:29.8580322265625, mcHandL2X:152.9, mcHandL2Y:929.6, mcHandL2Rotate:68.05734252929688, mcHandRX:189.5, mcHandRY:638.95, mcHandRRotate:-96.55705261230469, mcHandR1X:174.3, mcHandR1Y:786.6, mcHandR1Rotate:-141.64157104492188, mcHandR2X:206.45, mcHandR2Y:710.75, mcHandR2Rotate:143.4182586669922, },
{mcHeadX:139.4, mcHeadY:946.1, mcHeadRotate:-119.85868835449219, mcBodyX:264.05, mcBodyY:815.55, mcBodyRotate:-135.86276245117188, mcPantX:250.55, mcPantY:821.6, mcPantRotate:-42.13642883300781, mcHandLX:77.5, mcHandLY:1074.75, mcHandLRotate:-22.318496704101563, mcHandL1X:201.95, mcHandL1Y:954.35, mcHandL1Rotate:22.322982788085938, mcHandL2X:144.6, mcHandL2Y:1029.45, mcHandL2Rotate:-10.81378173828125, mcHandRX:107.9, mcHandRY:732.75, mcHandRRotate:-111.57843017578125, mcHandR1X:135.3, mcHandR1Y:884.8, mcHandR1Rotate:-156.68397521972656, mcHandR2X:145.7, mcHandR2Y:799.6, mcHandR2Rotate:128.36863708496094, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, },
{mcHeadX:117.1, mcHeadY:1047.9, mcHeadRotate:-134.99913024902344, mcBodyX:216.5, mcBodyY:874.1, mcBodyRotate:-150.8092041015625, mcPantX:203.6, mcPantY:884.3, mcPantRotate:-57.20989990234375, mcHandLX:57.2, mcHandLY:1163.25, mcHandLRotate:-29.998565673828125, mcHandL1X:184.85, mcHandL1Y:1046.3, mcHandL1Rotate:14.999740600585938, mcHandL2X:136.25, mcHandL2Y:1129.3, mcHandL2Rotate:90.00175476074219, mcHandRX:26.2, mcHandRY:826.5, mcHandRRotate:-126.71734619140625, mcHandR1X:96.35, mcHandR1Y:982.95, mcHandR1Rotate:-171.60130310058594, mcHandR2X:84.85, mcHandR2Y:888.55, mcHandR2Rotate:113.44125366210938, }];

var rightFallStartFrame = 14;
var leftFallStartFrame = 36;
var falldownTotalFrame = 8;

var buildings_arr = ['assets/building1.png','assets/building2.png','assets/building3.png','assets/building4.png','assets/building5.png'];

var playerData = {distance:0, score:0};
var gameData = {pause:true, controlX:0, x:0, xEase:0, speed:0, curSpeed:0, frame:1, bDistance:0, bNum:0, bSide:false, bLoop:true, walk:false, walkSound:false};
var extraData = {extra:0, extraEase:0, timer:0};
var buildingsLoop_arr = [];


/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	//main
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("mousedown", function(evt) {
		playSound('soundHeart');
		goPage('game');
	});
	
	buttonReplay.cursor = "pointer";
	buttonReplay.addEventListener("mousedown", function(evt) {
		playSound('soundHeart');
		goPage('game');
	});
	
	buttonShare.cursor = "pointer";
	buttonShare.addEventListener("mousedown", function(evt) {
		playSound('soundHeart');
		goPage('share');
	});
	
	buttonBack.cursor = "pointer";
	buttonBack.addEventListener("mousedown", function(evt) {
		playSound('soundHeart');
		goPage('result');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonGoogle.cursor = "pointer";
	buttonGoogle.addEventListener("click", function(evt) {
		share('google');
	});
}

function buildInGameButton(){
	if(!$.browser.mobile || !isTablet){
		falldownPercent = falldownPercentMobile;

		stage.on("stagemousemove", function(evt) {
			var stageX = evt.stageX / scalePercent;
			gameData.controlX = stageX-(canvasW/2);
		});
	}
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
function goPage(page){
	gameContainer.visible=false;
	txtDistanceResult.visible=false;
	
	toggleTransition(mainContainer, false);
	toggleTransition(scoreContainer, false);
	toggleTransition(shareContainer, false);
	
	switch(page){
		case 'main':
			stopGame();
			toggleTransition(mainContainer, true); 
		break;
		
		case 'game':
			gameContainer.visible=true;
			startGame();
		break;
		
		case 'result':
			txtDistanceResult.visible=true;
			toggleTransition(scoreContainer, true);
			stopGame();
		break;
		
		case 'share':
			txtDistanceResult.visible=true;
			toggleTransition(shareContainer, true);
		break;
	}
}

function toggleTransition(obj, con){
	if(con){
		obj.visible = true;
		TweenMax.to(obj, .5, {y:0, overwrite:true});
	}else if(obj.y <= 0){
		TweenMax.to(obj, .5, {y:-800, overwrite:true, onComplete:function(){
			obj.visible = false;	
		}}); 
	}
}

/*!
 * 
 * START GAME - This is the function that runs to create new game
 * 
 */
 function startGame(){
	 falldownInit = false;
	playerData.distance = 0;
	gameData.controlX = 0;
	gameData.x = 0;
	gameData.xEase = 0;
	gameData.speed = 0;
	gameData.walk = false;
	
	extraData.timer = 0;
	extraData.extra = 0;
	extraData.extraEase = 0;
	
	humanBottomAnimation.x = canvasW/100 * 51;
	humanBottomAnimation.y = canvasH/100 * 62;
	
	humanBottomAnimation.gotoAndStop(1);
	positionHuman(0);
	toggleCountdown(true);
	
	humanContainer.alpha = 0;
	TweenMax.to(humanContainer, .5, {alpha:1, overwrite:true}); 
 }
 
 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
 function stopGame(){
	 txtDistanceResult.alpha = 0;
	 TweenMax.to(txtDistanceResult, .5, {alpha:1, overwrite:true}); 
	 
	  gameData.speed = 5;
	  toggleCountdown(false);
	  toggleFalldown(false);
 }
 
 /*!
 * 
 * UPDATE CONTROL - This is the function that runs to update mouse or phone tilt data
 * 
 */
 
 function updatePlayerPos(){
	gameData.x = gameData.controlX + extraData.extraEase;
	if(Math.abs(gameData.x - gameData.xEase) > 100){
		startShockSound();
	}
	TweenMax.to(gameData, .5, {xEase:gameData.x, overwrite:true, onUpdate:movePlayerPosX});
 }

/*!
 * 
 * PLAYER MOVE - This is the function that runs when player move left right
 * 
 */
 function movePlayerPosX(){
	 var widthPercentage = (canvasW/2)/100 * 90;
	 var endLeft = -(widthPercentage);
	 var endRight = widthPercentage;
	 gameData.xEase=gameData.xEase<=endLeft?endLeft:gameData.xEase;
	 gameData.xEase=gameData.xEase>endRight?endRight:gameData.xEase;
	 
	 var totalFrames = rightFallStartFrame;
	 var newFrame = gameData.xEase/widthPercentage * totalFrames;
	 newFrame = Math.abs(Math.floor(newFrame));
	 
	 var newRotate = gameData.xEase/widthPercentage * bottomRotateRange;
	 
	 if(gameData.xEase <0){
		newRotate = Math.abs(newRotate);
		newFrame += falldownTotalFrame + rightFallStartFrame;
	 }else{
		newRotate = -(newRotate);
	 }
	 
	 var moveSpeed = Math.abs(Math.floor(newRotate));
	 gameData.speed = moveSpeed;
	 
	 if(newFrame == rightFallStartFrame || newFrame == (leftFallStartFrame)){
		 gameData.pause = true;
		 initFalldown(newFrame);
	 }
	 
	 positionHuman(newFrame);
	 humanBottomAnimation.rotation = newRotate;
 }

/*!
 * 
 * GAME LOOP - This is the function that runs for game loop
 * 
 */
function updateGame(){
	if(!gameData.pause){
		if(extraData.timer <= 0){
			var level = canvasW/100 *falldownPercent;
			extraData.timer = (Math.random()*falldownUpdate) + (falldownUpdate/2);
			extraData.extraEase = Math.floor(Math.random()*level - (level/2));
		}else{
			extraData.timer--;
		}
		
		updatePlayerPos();
		updatePlayerMoveSpeed();
		updateDistance();
	}
	
	if(gameData.bLoop)
		updateBuildings();
}


/*!
 * 
 * UPDATE DISTANCE - This is the function that runs to update distance
 * 
 */
 
function updateDistance(){
	playerData.distance += (bottomRotateRange - gameData.speed);
	playerData.score = (playerData.distance * .0005).toFixed(1);
	playerData.score = distanceDisplay.replace('[NUMBER]',playerData.score)
	txtDistance.text = playerData.score;
	txtDistanceResult.text = playerData.score;
}

/*!
 * 
 * BUILDINGS LOOP - This is the function that runs to loop buildings
 * 
 */
 
function updateBuildings(){
	if(gameData.bDistance <= 0){
		gameData.bDistance = (Math.random()*buildingDistance) + (buildingDistance/2);
		createBuilding();
	}else{
		gameData.bDistance -= (bottomRotateRange - gameData.speed);
	}
	
	for(n=0;n<buildingsLoop_arr.length;n++){
		var alphaPercent = ($.building[buildingsLoop_arr[n]].y/canvasH * 1.5)-.5;
		var scalePercent = ($.building[buildingsLoop_arr[n]].y/canvasH * .7)+.1;
		var movePercent = $.building[buildingsLoop_arr[n]].y/canvasH * .5;
		var moveSpeed = (bottomRotateRange - gameData.speed) * movePercent;
		
		$.building[buildingsLoop_arr[n]].y += moveSpeed;
		
		if($.building[buildingsLoop_arr[n]].side){
			$.building[buildingsLoop_arr[n]].scaleX = scalePercent;
		}else{
			$.building[buildingsLoop_arr[n]].scaleX = -(scalePercent);	
		}
		
		$.building[buildingsLoop_arr[n]].scaleY = scalePercent;
		$.building[buildingsLoop_arr[n]].alpha = alphaPercent;
		
		if($.building[buildingsLoop_arr[n]].y > canvasH*2){
			removeBuilding(n);
		}
	}
}


/*!
 * 
 * CREATE AND REMOVE BUILDINGS - This is the function that runs to create or remove buildings
 * 
 */
 
function buildStartBuilding(){
	createBuilding(canvasH/100 * 80);
	createBuilding(canvasH/100 * 60);
	createBuilding(canvasH/100 * 50);
}

function createBuilding(posY){
	var buildingTypeNum = Math.floor(Math.random()*buildings_arr.length);;
	$.building[gameData.bNum] = $.buildingClone[buildingTypeNum].clone();
	$.building[gameData.bNum].side = gameData.side;
	
	var buildingRange = canvasW/5;
	if(gameData.side){
		gameData.side = false;
		$.building[gameData.bNum].x = (buildingRange*1.5) + (Math.random()*buildingRange);
	}else{
		gameData.side = true;
		$.building[gameData.bNum].x = (buildingRange*2.5)+Math.random()*buildingRange;
		$.building[gameData.bNum].scaleX = -1;
	}
	if(isNaN(posY)){
		$.building[gameData.bNum].y = canvasH/100 * buildingStartPosY;
	}else{
		$.building[gameData.bNum].y = posY;	
	}
	
	buildingContainer.addChild($.building[gameData.bNum]);
	buildingContainer.setChildIndex($.building[gameData.bNum], 0);
	
	buildingsLoop_arr.push(gameData.bNum);
	gameData.bNum++;
}

function removeBuilding(num){
	buildingContainer.removeChild($.building[buildingsLoop_arr[num]]);
	buildingsLoop_arr.splice(num, 1);
}

/*!
 * 
 * HUMAN MOVE SPEED - This is the function that runs for human move speed
 * 
 */
 
function updatePlayerMoveSpeed(){
	if(gameData.curSpeed <= 0){
		gameData.curSpeed = gameData.speed;
		gameData.frame++;
		
		var totalFrames = humanBottomData.getNumFrames()-1;
		gameData.frame = gameData.frame > totalFrames ? 1 : gameData.frame;
	}else{
		gameData.curSpeed--;
	}
	humanBottomAnimation.gotoAndStop(gameData.frame);
	
	if(gameData.frame == 1){
		gameData.walk = false;
	}else if(gameData.frame == (humanBottomData.getNumFrames()-1) && !gameData.walk){
		gameData.walk = true;
		
		if(gameData.walkSound){
			gameData.walkSound = false;
			playSound('soundRope1');
		}else{
			gameData.walkSound = true;
			playSound('soundRope2');	
		}
	}
}

/*!
 * 
 * HUMAN POSITION - This is the function that runs to position human from data
 * 
 */
function positionHuman(num){
	head.x = data_arr[num].mcHeadX;
	head.y = data_arr[num].mcHeadY;
	head.rotation = data_arr[num].mcHeadRotate;
	
	hBody.x = data_arr[num].mcBodyX;
	hBody.y = data_arr[num].mcBodyY;
	hBody.rotation = data_arr[num].mcBodyRotate;
	
	handL.x = data_arr[num].mcHandLX;
	handL.y = data_arr[num].mcHandLY;
	handL.rotation = data_arr[num].mcHandLRotate;
	
	handL1.x = data_arr[num].mcHandL1X;
	handL1.y = data_arr[num].mcHandL1Y;
	handL1.rotation = data_arr[num].mcHandL1Rotate;
	
	handL2.x = data_arr[num].mcHandL2X;
	handL2.y = data_arr[num].mcHandL2Y;
	handL2.rotation = data_arr[num].mcHandL2Rotate;
	
	handR.x = data_arr[num].mcHandRX;
	handR.y = data_arr[num].mcHandRY;
	handR.rotation = data_arr[num].mcHandRRotate;
	
	handR1.x = data_arr[num].mcHandR1X;
	handR1.y = data_arr[num].mcHandR1Y;
	handR1.rotation = data_arr[num].mcHandR1Rotate;
	
	handR2.x = data_arr[num].mcHandR2X;
	handR2.y = data_arr[num].mcHandR2Y;
	handR2.rotation = data_arr[num].mcHandR2Rotate;
	
	if(gameData.pause){
		humanBottomAnimation.x = data_arr[num].mcPantX;
		humanBottomAnimation.y = data_arr[num].mcPantY;
		humanBottomAnimation.rotation = data_arr[num].mcPantRotate;	
	}
}

/*!
 * 
 * FALLDOWN ANIMATION - This is the function that runs falling down animation
 * 
 */
var falldownEndFrame = 0;
var falldownStartFrame = 0;
var falldownInterval = null;

function initFalldown(frame){
	TweenMax.killTweensOf(gameData);
	
	falldownStartFrame = frame+1;
	if(frame == rightFallStartFrame){
		falldownEndFrame = falldownTotalFrame + rightFallStartFrame;
	}else{
		falldownEndFrame = falldownTotalFrame + leftFallStartFrame;
	}
	
	toggleFalldown(true);
	playSound('soundFall');
	
	var screamNum = Math.floor(Math.random()*3)+1;
	playSound('soundHumanscream'+screamNum);
}

function toggleFalldown(con){
	if(con){
		clearInterval(falldownInterval);
		falldownInterval = setInterval(function(){
			positionHuman(falldownStartFrame);
			falldownStartFrame++;
			
			if(falldownStartFrame >= falldownEndFrame){
				toggleFalldown(false);
				goPage('result');
			}
		}, 50);
	}else{
		clearInterval(falldownInterval);
	}
}

/*!
 * 
 * COUNTDOWN - This is the function that runs countdown timer
 * 
 */
var countdownInterval = null;
function toggleCountdown(con){
	txtDistance.visible = false;
	txtCountdown.visible = false;
	txtInstruction.visible = false;
	
	if(!$.browser.mobile || !isTablet){
		txtInstruction.text = instructionDesktop;
	}else{
		txtInstruction.text = instructionMobile;
	}
	
	if(con){
		countNum = 0;
		countdownInterval = setInterval(updateCountdown, 800);
		updateCountdown();
		txtCountdown.visible = true;
		txtInstruction.visible = true;
		gameData.bLoop = false;
	}else{
		clearInterval(countdownInterval);
		countdownInterval = null;
		txtDistance.visible = true;
		gameData.bLoop = true;
	}
}

function updateCountdown(){
	txtCountdown.text = countdown_arr[countNum];
	countNum++;
	if(countNum > countdown_arr.length){
		toggleCountdown(false);
		gameData.pause = false;
	}else if(countNum == countdown_arr.length){
		playSound('soundBeepFinal');
	}else{
		playSound('soundBeep');	
	}
}


/*!
 * 
 * DEVICE ORIENTATION UPDATE - This is the function that runs update device orientation data
 * 
 */
function updateOrientation(data){
	var oData=Math.round(data);
	gameData.controlX = (oData/100*canvasW);
}

var shockInterval = null;
function startShockSound(){
	if(shockInterval == null){
		playShockSound();
	}
}

function playShockSound(){
	var shockNum = Math.floor(Math.random()*3)+1;
	playSound('soundShock'+shockNum);
	
	shockInterval = setInterval(function(){
		clearInterval(shockInterval);
		shockInterval = null;
	}, 1500);
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	var title = shareTitle.replace("[SCORE]", playerData.score);
	var text = shareMessage.replace("[SCORE]", playerData.score);
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'http://www.facebook.com/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}
	
	window.open(shareurl);
}