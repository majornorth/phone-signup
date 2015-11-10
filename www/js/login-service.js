(function() {
    'use strict';

    angular
        .module('starter')
        .service('loginService', loginService);

    loginService.$inject = ['$q', '$timeout', '$window', '$firebaseArray'];

    function loginService($q, $timeout, $window, $firebaseArray) {

        var phonenumber;
        var countryCode;
        var defaultCountryCode = 'us'; // CHANGE THIS VARIABLE AT YOUR CONVENIENCE

        var service = {
            getPhonenumber: function() {return phonenumber;},
            setPhonenumber: function(p) {phonenumber = p;},
            getCountry: function() {return getCountries()[countryCode || defaultCountryCode];},
            setCountry: function(c) {countryCode = c.countryCode;},
            getFormattedNumber: getFormattedNumber,
            sendConfirmationCode: sendConfirmationCode,
            verifyConfirmationCode: verifyConfirmationCode,
            getCountries: getCountries
        };

        return service;

        //////////////////////////////////

        function sendConfirmationCode() {
            var deferred = $q.defer();
            $timeout(function() {

                var usersRef = new Firebase('https://soccersubs.firebaseio.com/users/');
                var usersArray = $firebaseArray(usersRef);

                var verificationCode = Math.floor(Math.random()*9999);

                var number = getFormattedNumber();

                checkIfUserExists(number);

                function checkIfUserExists(number) {
                    usersRef.child(number).once('value', function(snapshot) {
                      var exists = (snapshot.val() !== null);
                      userExistsCallback(number, exists);
                    });
                }

                function userExistsCallback(number, exists) {
                    if (exists) {

                        //Abstract below into service
                        var cleanNum = number.replace(/[^a-zA-Z0-9 ]/g, "");
                        var userId = '%2B' + cleanNum;
                        var newUserUrl = 'https://soccersubs.firebaseio.com/users/' + userId;
                        var newUserRef = new Firebase(newUserUrl);

                        newUserRef.update({
                            verificationCode: verificationCode
                        });

                        var confirmRef = new Firebase('https://soccersubs.firebaseio.com/verification_queue/');
                        var confirmQueue = $firebaseArray(confirmRef);

                        confirmQueue.$add({
                            phone: number,
                            verificationCode: verificationCode
                        });
                    } else {
                      // create a new account
                      var cleanNum = number.replace(/[^a-zA-Z0-9 ]/g, "");
                      var userId = '%2B' + cleanNum;
                      var newUserUrl = 'https://soccersubs.firebaseio.com/users/' + userId;
                      var newUserRef = new Firebase(newUserUrl);

                      newUserRef.set({
                        firstName: '',
                        lastName: '',
                        position: '',
                        skill: '',
                        verificationCode: verificationCode
                      });

                      var confirmRef = new Firebase('https://soccersubs.firebaseio.com/verification_queue/');
                      var confirmQueue = $firebaseArray(confirmRef);

                      confirmQueue.$add({
                          phone: number,
                          verificationCode: verificationCode
                      });
                    }
                }

                deferred.resolve();
            }, 1000);
            return deferred.promise;
        }

        function verifyConfirmationCode(code) {
            var deferred = $q.defer();
            $timeout(function() {

                var number = getFormattedNumber();
                var cleanNum = number.replace(/[^a-zA-Z0-9 ]/g, "");
                var userId = '%2B' + cleanNum;
                var userIdRefUrl = 'https://soccersubs.firebaseio.com/users/' + userId;
                var userIdRef = new Firebase(userIdRefUrl);
                var userVerificationCodeRef = userIdRef.child('verificationCode');

                function verifyUser(code) {
                    userVerificationCodeRef.on('value', function(snapshot) {
                      var verifiedMatch = (snapshot.val() === code);

                      if (verifiedMatch) {
                        deferred.resolve();
                      } else {
                        deferred.reject();
                      }
                    });
                }

                verifyUser(code);
            }, 1000);
            return deferred.promise;
        }

        /**
         * Formats the phonenumber following the E164 format, you need to use this number to make sure
         * the user will receive the code
         */
        function getFormattedNumber() {
            return $window.phoneUtils.formatE164(phonenumber, countryCode || defaultCountryCode);
        }

        /**
         * return all the countries
         */
        function getCountries() {
            return {
                'af': {
                    name: 'Afghanistan (‫افغانستان‬‎)',
                    countryCode: 'af',
                    intlPrefix: '93'
                },
                'al': {
                    name: 'Albania (Shqipëri)',
                    countryCode: 'al',
                    intlPrefix: '355'
                },
                'dz': {
                    name: 'Algeria (‫الجزائر‬‎)',
                    countryCode: 'dz',
                    intlPrefix: '213'
                },
                'as': {
                    name: 'American Samoa',
                    countryCode: 'as',
                    intlPrefix: '1684'
                },
                'ad': {
                    name: 'Andorra',
                    countryCode: 'ad',
                    intlPrefix: '376'
                },
                'ao': {
                    name: 'Angola',
                    countryCode: 'ao',
                    intlPrefix: '244'
                },
                'ai': {
                    name: 'Anguilla',
                    countryCode: 'ai',
                    intlPrefix: '1264'
                },
                'ag': {
                    name: 'Antigua and Barbuda',
                    countryCode: 'ag',
                    intlPrefix: '1268'
                },
                'ar': {
                    name: 'Argentina',
                    countryCode: 'ar',
                    intlPrefix: '54'
                },
                'am': {
                    name: 'Armenia (Հայաստան)',
                    countryCode: 'am',
                    intlPrefix: '374'
                },
                'aw': {
                    name: 'Aruba',
                    countryCode: 'aw',
                    intlPrefix: '297'
                },
                'au': {
                    name: 'Australia',
                    countryCode: 'au',
                    intlPrefix: '61'
                },
                'at': {
                    name: 'Austria (Österreich)',
                    countryCode: 'at',
                    intlPrefix: '43'
                },
                'az': {
                    name: 'Azerbaijan (Azərbaycan)',
                    countryCode: 'az',
                    intlPrefix: '994'
                },
                'bs': {
                    name: 'Bahamas',
                    countryCode: 'bs',
                    intlPrefix: '1242'
                },
                'bh': {
                    name: 'Bahrain (‫البحرين‬‎)',
                    countryCode: 'bh',
                    intlPrefix: '973'
                },
                'bd': {
                    name: 'Bangladesh (বাংলাদেশ)',
                    countryCode: 'bd',
                    intlPrefix: '880'
                },
                'bb': {
                    name: 'Barbados',
                    countryCode: 'bb',
                    intlPrefix: '1246'
                },
                'by': {
                    name: 'Belarus (Беларусь)',
                    countryCode: 'by',
                    intlPrefix: '375'
                },
                'be': {
                    name: 'Belgium (België)',
                    countryCode: 'be',
                    intlPrefix: '32'
                },
                'bz': {
                    name: 'Belize',
                    countryCode: 'bz',
                    intlPrefix: '501'
                },
                'bj': {
                    name: 'Benin (Bénin)',
                    countryCode: 'bj',
                    intlPrefix: '229'
                },
                'bm': {
                    name: 'Bermuda',
                    countryCode: 'bm',
                    intlPrefix: '1441'
                },
                'bt': {
                    name: 'Bhutan (འབྲུག)',
                    countryCode: 'bt',
                    intlPrefix: '975'
                },
                'bo': {
                    name: 'Bolivia',
                    countryCode: 'bo',
                    intlPrefix: '591'
                },
                'ba': {
                    name: 'Bosnia and Herzegovina (Босна и Херцеговина)',
                    countryCode: 'ba',
                    intlPrefix: '387'
                },
                'bw': {
                    name: 'Botswana',
                    countryCode: 'bw',
                    intlPrefix: '267'
                },
                'br': {
                    name: 'Brazil (Brasil)',
                    countryCode: 'br',
                    intlPrefix: '55'
                },
                'io': {
                    name: 'British Indian Ocean Territory',
                    countryCode: 'io',
                    intlPrefix: '246'
                },
                'vg': {
                    name: 'British Virgin Islands',
                    countryCode: 'vg',
                    intlPrefix: '1284'
                },
                'bn': {
                    name: 'Brunei',
                    countryCode: 'bn',
                    intlPrefix: '673'
                },
                'bg': {
                    name: 'Bulgaria (България)',
                    countryCode: 'bg',
                    intlPrefix: '359'
                },
                'bf': {
                    name: 'Burkina Faso',
                    countryCode: 'bf',
                    intlPrefix: '226'
                },
                'bi': {
                    name: 'Burundi (Uburundi)',
                    countryCode: 'bi',
                    intlPrefix: '257'
                },
                'kh': {
                    name: 'Cambodia (កម្ពុជា)',
                    countryCode: 'kh',
                    intlPrefix: '855'
                },
                'cm': {
                    name: 'Cameroon (Cameroun)',
                    countryCode: 'cm',
                    intlPrefix: '237'
                },
                'ca': {
                    name: 'Canada',
                    countryCode: 'ca',
                    intlPrefix: '1'
                },
                'cv': {
                    name: 'Cape Verde (Kabu Verdi)',
                    countryCode: 'cv',
                    intlPrefix: '238'
                },
                'bq': {
                    name: 'Caribbean Netherlands',
                    countryCode: 'bq',
                    intlPrefix: '599'
                },
                'ky': {
                    name: 'Cayman Islands',
                    countryCode: 'ky',
                    intlPrefix: '1345'
                },
                'cf': {
                    name: 'Central African Republic (République centrafricaine)',
                    countryCode: 'cf',
                    intlPrefix: '236'
                },
                'td': {
                    name: 'Chad (Tchad)',
                    countryCode: 'td',
                    intlPrefix: '235'
                },
                'cl': {
                    name: 'Chile',
                    countryCode: 'cl',
                    intlPrefix: '56'
                },
                'cn': {
                    name: 'China (中国)',
                    countryCode: 'cn',
                    intlPrefix: '86'
                },
                'co': {
                    name: 'Colombia',
                    countryCode: 'co',
                    intlPrefix: '57'
                },
                'km': {
                    name: 'Comoros (‫جزر القمر‬‎)',
                    countryCode: 'km',
                    intlPrefix: '269'
                },
                'cd': {
                    name: 'Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)',
                    countryCode: 'cd',
                    intlPrefix: '243'
                },
                'cg': {
                    name: 'Congo (Republic) (Congo-Brazzaville)',
                    countryCode: 'cg',
                    intlPrefix: '242'
                },
                'ck': {
                    name: 'Cook Islands',
                    countryCode: 'ck',
                    intlPrefix: '682'
                },
                'cr': {
                    name: 'Costa Rica',
                    countryCode: 'cr',
                    intlPrefix: '506'
                },
                'ci': {
                    name: 'Côte d’Ivoire',
                    countryCode: 'ci',
                    intlPrefix: '225'
                },
                'hr': {
                    name: 'Croatia (Hrvatska)',
                    countryCode: 'hr',
                    intlPrefix: '385'
                },
                'cu': {
                    name: 'Cuba',
                    countryCode: 'cu',
                    intlPrefix: '53'
                },
                'cw': {
                    name: 'Curaçao',
                    countryCode: 'cw',
                    intlPrefix: '599'
                },
                'cy': {
                    name: 'Cyprus (Κύπρος)',
                    countryCode: 'cy',
                    intlPrefix: '357'
                },
                'cz': {
                    name: 'Czech Republic (Česká republika)',
                    countryCode: 'cz',
                    intlPrefix: '420'
                },
                'dk': {
                    name: 'Denmark (Danmark)',
                    countryCode: 'dk',
                    intlPrefix: '45'
                },
                'dj': {
                    name: 'Djibouti',
                    countryCode: 'dj',
                    intlPrefix: '253'
                },
                'dm': {
                    name: 'Dominica',
                    countryCode: 'dm',
                    intlPrefix: '1767'
                },
                'do': {
                    name: 'Dominican Republic (República Dominicana)',
                    countryCode: 'do',
                    intlPrefix: '1'
                },
                'ec': {
                    name: 'Ecuador',
                    countryCode: 'ec',
                    intlPrefix: '593'
                },
                'eg': {
                    name: 'Egypt (‫مصر‬‎)',
                    countryCode: 'eg',
                    intlPrefix: '20'
                },
                'sv': {
                    name: 'El Salvador',
                    countryCode: 'sv',
                    intlPrefix: '503'
                },
                'gq': {
                    name: 'Equatorial Guinea (Guinea Ecuatorial)',
                    countryCode: 'gq',
                    intlPrefix: '240'
                },
                'er': {
                    name: 'Eritrea',
                    countryCode: 'er',
                    intlPrefix: '291'
                },
                'ee': {
                    name: 'Estonia (Eesti)',
                    countryCode: 'ee',
                    intlPrefix: '372'
                },
                'et': {
                    name: 'Ethiopia',
                    countryCode: 'et',
                    intlPrefix: '251'
                },
                'fk': {
                    name: 'Falkland Islands (Islas Malvinas)',
                    countryCode: 'fk',
                    intlPrefix: '500'
                },
                'fo': {
                    name: 'Faroe Islands (Føroyar)',
                    countryCode: 'fo',
                    intlPrefix: '298'
                },
                'fj': {
                    name: 'Fiji',
                    countryCode: 'fj',
                    intlPrefix: '679'
                },
                'fi': {
                    name: 'Finland (Suomi)',
                    countryCode: 'fi',
                    intlPrefix: '358'
                },
                'fr': {
                    name: 'France',
                    countryCode: 'fr',
                    intlPrefix: '33'
                },
                'gf': {
                    name: 'French Guiana (Guyane française)',
                    countryCode: 'gf',
                    intlPrefix: '594'
                },
                'pf': {
                    name: 'French Polynesia (Polynésie française)',
                    countryCode: 'pf',
                    intlPrefix: '689'
                },
                'ga': {
                    name: 'Gabon',
                    countryCode: 'ga',
                    intlPrefix: '241'
                },
                'gm': {
                    name: 'Gambia',
                    countryCode: 'gm',
                    intlPrefix: '220'
                },
                'ge': {
                    name: 'Georgia (საქართველო)',
                    countryCode: 'ge',
                    intlPrefix: '995'
                },
                'de': {
                    name: 'Germany (Deutschland)',
                    countryCode: 'de',
                    intlPrefix: '49'
                },
                'gh': {
                    name: 'Ghana (Gaana)',
                    countryCode: 'gh',
                    intlPrefix: '233'
                },
                'gi': {
                    name: 'Gibraltar',
                    countryCode: 'gi',
                    intlPrefix: '350'
                },
                'gr': {
                    name: 'Greece (Ελλάδα)',
                    countryCode: 'gr',
                    intlPrefix: '30'
                },
                'gl': {
                    name: 'Greenland (Kalaallit Nunaat)',
                    countryCode: 'gl',
                    intlPrefix: '299'
                },
                'gd': {
                    name: 'Grenada',
                    countryCode: 'gd',
                    intlPrefix: '1473'
                },
                'gp': {
                    name: 'Guadeloupe',
                    countryCode: 'gp',
                    intlPrefix: '590'
                },
                'gu': {
                    name: 'Guam',
                    countryCode: 'gu',
                    intlPrefix: '1671'
                },
                'gt': {
                    name: 'Guatemala',
                    countryCode: 'gt',
                    intlPrefix: '502'
                },
                'gn': {
                    name: 'Guinea (Guinée)',
                    countryCode: 'gn',
                    intlPrefix: '224'
                },
                'gw': {
                    name: 'Guinea-Bissau (Guiné Bissau)',
                    countryCode: 'gw',
                    intlPrefix: '245'
                },
                'gy': {
                    name: 'Guyana',
                    countryCode: 'gy',
                    intlPrefix: '592'
                },
                'ht': {
                    name: 'Haiti',
                    countryCode: 'ht',
                    intlPrefix: '509'
                },
                'hn': {
                    name: 'Honduras',
                    countryCode: 'hn',
                    intlPrefix: '504'
                },
                'hk': {
                    name: 'Hong Kong (香港)',
                    countryCode: 'hk',
                    intlPrefix: '852'
                },
                'hu': {
                    name: 'Hungary (Magyarország)',
                    countryCode: 'hu',
                    intlPrefix: '36'
                },
                'is': {
                    name: 'Iceland (Ísland)',
                    countryCode: 'is',
                    intlPrefix: '354'
                },
                'in': {
                    name: 'India (भारत)',
                    countryCode: 'in',
                    intlPrefix: '91'
                },
                'id': {
                    name: 'Indonesia',
                    countryCode: 'id',
                    intlPrefix: '62'
                },
                'ir': {
                    name: 'Iran (‫ایران‬‎)',
                    countryCode: 'ir',
                    intlPrefix: '98'
                },
                'iq': {
                    name: 'Iraq (‫العراق‬‎)',
                    countryCode: 'iq',
                    intlPrefix: '964'
                },
                'ie': {
                    name: 'Ireland',
                    countryCode: 'ie',
                    intlPrefix: '353'
                },
                'il': {
                    name: 'Israel (‫ישראל‬‎)',
                    countryCode: 'il',
                    intlPrefix: '972'
                },
                'it': {
                    name: 'Italy (Italia)',
                    countryCode: 'it',
                    intlPrefix: '39'
                },
                'jm': {
                    name: 'Jamaica',
                    countryCode: 'jm',
                    intlPrefix: '1876'
                },
                'jp': {
                    name: 'Japan (日本)',
                    countryCode: 'jp',
                    intlPrefix: '81'
                },
                'jo': {
                    name: 'Jordan (‫الأردن‬‎)',
                    countryCode: 'jo',
                    intlPrefix: '962'
                },
                'kz': {
                    name: 'Kazakhstan (Казахстан)',
                    countryCode: 'kz',
                    intlPrefix: '7'
                },
                'ke': {
                    name: 'Kenya',
                    countryCode: 'ke',
                    intlPrefix: '254'
                },
                'ki': {
                    name: 'Kiribati',
                    countryCode: 'ki',
                    intlPrefix: '686'
                },
                'kw': {
                    name: 'Kuwait (‫الكويت‬‎)',
                    countryCode: 'kw',
                    intlPrefix: '965'
                },
                'kg': {
                    name: 'Kyrgyzstan (Кыргызстан)',
                    countryCode: 'kg',
                    intlPrefix: '996'
                },
                'la': {
                    name: 'Laos (ລາວ)',
                    countryCode: 'la',
                    intlPrefix: '856'
                },
                'lv': {
                    name: 'Latvia (Latvija)',
                    countryCode: 'lv',
                    intlPrefix: '371'
                },
                'lb': {
                    name: 'Lebanon (‫لبنان‬‎)',
                    countryCode: 'lb',
                    intlPrefix: '961'
                },
                'ls': {
                    name: 'Lesotho',
                    countryCode: 'ls',
                    intlPrefix: '266'
                },
                'lr': {
                    name: 'Liberia',
                    countryCode: 'lr',
                    intlPrefix: '231'
                },
                'ly': {
                    name: 'Libya (‫ليبيا‬‎)',
                    countryCode: 'ly',
                    intlPrefix: '218'
                },
                'li': {
                    name: 'Liechtenstein',
                    countryCode: 'li',
                    intlPrefix: '423'
                },
                'lt': {
                    name: 'Lithuania (Lietuva)',
                    countryCode: 'lt',
                    intlPrefix: '370'
                },
                'lu': {
                    name: 'Luxembourg',
                    countryCode: 'lu',
                    intlPrefix: '352'
                },
                'mo': {
                    name: 'Macau (澳門)',
                    countryCode: 'mo',
                    intlPrefix: '853'
                },
                'mk': {
                    name: 'Macedonia (FYROM) (Македонија)',
                    countryCode: 'mk',
                    intlPrefix: '389'
                },
                'mg': {
                    name: 'Madagascar (Madagasikara)',
                    countryCode: 'mg',
                    intlPrefix: '261'
                },
                'mw': {
                    name: 'Malawi',
                    countryCode: 'mw',
                    intlPrefix: '265'
                },
                'my': {
                    name: 'Malaysia',
                    countryCode: 'my',
                    intlPrefix: '60'
                },
                'mv': {
                    name: 'Maldives',
                    countryCode: 'mv',
                    intlPrefix: '960'
                },
                'ml': {
                    name: 'Mali',
                    countryCode: 'ml',
                    intlPrefix: '223'
                },
                'mt': {
                    name: 'Malta',
                    countryCode: 'mt',
                    intlPrefix: '356'
                },
                'mh': {
                    name: 'Marshall Islands',
                    countryCode: 'mh',
                    intlPrefix: '692'
                },
                'mq': {
                    name: 'Martinique',
                    countryCode: 'mq',
                    intlPrefix: '596'
                },
                'mr': {
                    name: 'Mauritania (‫موريتانيا‬‎)',
                    countryCode: 'mr',
                    intlPrefix: '222'
                },
                'mu': {
                    name: 'Mauritius (Moris)',
                    countryCode: 'mu',
                    intlPrefix: '230'
                },
                'mx': {
                    name: 'Mexico (México)',
                    countryCode: 'mx',
                    intlPrefix: '52'
                },
                'fm': {
                    name: 'Micronesia',
                    countryCode: 'fm',
                    intlPrefix: '691'
                },
                'md': {
                    name: 'Moldova (Republica Moldova)',
                    countryCode: 'md',
                    intlPrefix: '373'
                },
                'mc': {
                    name: 'Monaco',
                    countryCode: 'mc',
                    intlPrefix: '377'
                },
                'mn': {
                    name: 'Mongolia (Монгол)',
                    countryCode: 'mn',
                    intlPrefix: '976'
                },
                'me': {
                    name: 'Montenegro (Crna Gora)',
                    countryCode: 'me',
                    intlPrefix: '382'
                },
                'ms': {
                    name: 'Montserrat',
                    countryCode: 'ms',
                    intlPrefix: '1664'
                },
                'ma': {
                    name: 'Morocco (‫المغرب‬‎)',
                    countryCode: 'ma',
                    intlPrefix: '212'
                },
                'mz': {
                    name: 'Mozambique (Moçambique)',
                    countryCode: 'mz',
                    intlPrefix: '258'
                },
                'mm': {
                    name: 'Myanmar (Burma) (မြန်မာ)',
                    countryCode: 'mm',
                    intlPrefix: '95'
                },
                'na': {
                    name: 'Namibia (Namibië)',
                    countryCode: 'na',
                    intlPrefix: '264'
                },
                'nr': {
                    name: 'Nauru',
                    countryCode: 'nr',
                    intlPrefix: '674'
                },
                'np': {
                    name: 'Nepal (नेपाल)',
                    countryCode: 'np',
                    intlPrefix: '977'
                },
                'nl': {
                    name: 'Netherlands (Nederland)',
                    countryCode: 'nl',
                    intlPrefix: '31'
                },
                'nc': {
                    name: 'New Caledonia (Nouvelle-Calédonie)',
                    countryCode: 'nc',
                    intlPrefix: '687'
                },
                'nz': {
                    name: 'New Zealand',
                    countryCode: 'nz',
                    intlPrefix: '64'
                },
                'ni': {
                    name: 'Nicaragua',
                    countryCode: 'ni',
                    intlPrefix: '505'
                },
                'ne': {
                    name: 'Niger (Nijar)',
                    countryCode: 'ne',
                    intlPrefix: '227'
                },
                'ng': {
                    name: 'Nigeria',
                    countryCode: 'ng',
                    intlPrefix: '234'
                },
                'nu': {
                    name: 'Niue',
                    countryCode: 'nu',
                    intlPrefix: '683'
                },
                'nf': {
                    name: 'Norfolk Island',
                    countryCode: 'nf',
                    intlPrefix: '672'
                },
                'kp': {
                    name: 'North Korea (조선 민주주의 인민 공화국)',
                    countryCode: 'kp',
                    intlPrefix: '850'
                },
                'mp': {
                    name: 'Northern Mariana Islands',
                    countryCode: 'mp',
                    intlPrefix: '1670'
                },
                'no': {
                    name: 'Norway (Norge)',
                    countryCode: 'no',
                    intlPrefix: '47'
                },
                'om': {
                    name: 'Oman (‫عُمان‬‎)',
                    countryCode: 'om',
                    intlPrefix: '968'
                },
                'pk': {
                    name: 'Pakistan (‫پاکستان‬‎)',
                    countryCode: 'pk',
                    intlPrefix: '92'
                },
                'pw': {
                    name: 'Palau',
                    countryCode: 'pw',
                    intlPrefix: '680'
                },
                'ps': {
                    name: 'Palestine (‫فلسطين‬‎)',
                    countryCode: 'ps',
                    intlPrefix: '970'
                },
                'pa': {
                    name: 'Panama (Panamá)',
                    countryCode: 'pa',
                    intlPrefix: '507'
                },
                'pg': {
                    name: 'Papua New Guinea',
                    countryCode: 'pg',
                    intlPrefix: '675'
                },
                'py': {
                    name: 'Paraguay',
                    countryCode: 'py',
                    intlPrefix: '595'
                },
                'pe': {
                    name: 'Peru (Perú)',
                    countryCode: 'pe',
                    intlPrefix: '51'
                },
                'ph': {
                    name: 'Philippines',
                    countryCode: 'ph',
                    intlPrefix: '63'
                },
                'pl': {
                    name: 'Poland (Polska)',
                    countryCode: 'pl',
                    intlPrefix: '48'
                },
                'pt': {
                    name: 'Portugal',
                    countryCode: 'pt',
                    intlPrefix: '351'
                },
                'pr': {
                    name: 'Puerto Rico',
                    countryCode: 'pr',
                    intlPrefix: '1'
                },
                'qa': {
                    name: 'Qatar (‫قطر‬‎)',
                    countryCode: 'qa',
                    intlPrefix: '974'
                },
                're': {
                    name: 'Réunion (La Réunion)',
                    countryCode: 're',
                    intlPrefix: '262'
                },
                'ro': {
                    name: 'Romania (România)',
                    countryCode: 'ro',
                    intlPrefix: '40'
                },
                'ru': {
                    name: 'Russia (Россия)',
                    countryCode: 'ru',
                    intlPrefix: '7'
                },
                'rw': {
                    name: 'Rwanda',
                    countryCode: 'rw',
                    intlPrefix: '250'
                },
                'bl': {
                    name: 'Saint Barthélemy (Saint-Barthélemy)',
                    countryCode: 'bl',
                    intlPrefix: '590'
                },
                'sh': {
                    name: 'Saint Helena',
                    countryCode: 'sh',
                    intlPrefix: '290'
                },
                'kn': {
                    name: 'Saint Kitts and Nevis',
                    countryCode: 'kn',
                    intlPrefix: '1869'
                },
                'lc': {
                    name: 'Saint Lucia',
                    countryCode: 'lc',
                    intlPrefix: '1758'
                },
                'mf': {
                    name: 'Saint Martin (Saint-Martin (partie française))',
                    countryCode: 'mf',
                    intlPrefix: '590'
                },
                'pm': {
                    name: 'Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)',
                    countryCode: 'pm',
                    intlPrefix: '508'
                },
                'vc': {
                    name: 'Saint Vincent and the Grenadines',
                    countryCode: 'vc',
                    intlPrefix: '1784'
                },
                'ws': {
                    name: 'Samoa',
                    countryCode: 'ws',
                    intlPrefix: '685'
                },
                'sm': {
                    name: 'San Marino',
                    countryCode: 'sm',
                    intlPrefix: '378'
                },
                'st': {
                    name: 'São Tomé and Príncipe (São Tomé e Príncipe)',
                    countryCode: 'st',
                    intlPrefix: '239'
                },
                'sa': {
                    name: 'Saudi Arabia (‫المملكة العربية السعودية‬‎)',
                    countryCode: 'sa',
                    intlPrefix: '966'
                },
                'sn': {
                    name: 'Senegal (Sénégal)',
                    countryCode: 'sn',
                    intlPrefix: '221'
                },
                'rs': {
                    name: 'Serbia (Србија)',
                    countryCode: 'rs',
                    intlPrefix: '381'
                },
                'sc': {
                    name: 'Seychelles',
                    countryCode: 'sc',
                    intlPrefix: '248'
                },
                'sl': {
                    name: 'Sierra Leone',
                    countryCode: 'sl',
                    intlPrefix: '232'
                },
                'sg': {
                    name: 'Singapore',
                    countryCode: 'sg',
                    intlPrefix: '65'
                },
                'sx': {
                    name: 'Sint Maarten',
                    countryCode: 'sx',
                    intlPrefix: '1721'
                },
                'sk': {
                    name: 'Slovakia (Slovensko)',
                    countryCode: 'sk',
                    intlPrefix: '421'
                },
                'si': {
                    name: 'Slovenia (Slovenija)',
                    countryCode: 'si',
                    intlPrefix: '386'
                },
                'sb': {
                    name: 'Solomon Islands',
                    countryCode: 'sb',
                    intlPrefix: '677'
                },
                'so': {
                    name: 'Somalia (Soomaaliya)',
                    countryCode: 'so',
                    intlPrefix: '252'
                },
                'za': {
                    name: 'South Africa',
                    countryCode: 'za',
                    intlPrefix: '27'
                },
                'kr': {
                    name: 'South Korea (대한민국)',
                    countryCode: 'kr',
                    intlPrefix: '82'
                },
                'ss': {
                    name: 'South Sudan (‫جنوب السودان‬‎)',
                    countryCode: 'ss',
                    intlPrefix: '211'
                },
                'es': {
                    name: 'Spain (España)',
                    countryCode: 'es',
                    intlPrefix: '34'
                },
                'lk': {
                    name: 'Sri Lanka (ශ්‍රී ලංකාව)',
                    countryCode: 'lk',
                    intlPrefix: '94'
                },
                'sd': {
                    name: 'Sudan (‫السودان‬‎)',
                    countryCode: 'sd',
                    intlPrefix: '249'
                },
                'sr': {
                    name: 'Suriname',
                    countryCode: 'sr',
                    intlPrefix: '597'
                },
                'sz': {
                    name: 'Swaziland',
                    countryCode: 'sz',
                    intlPrefix: '268'
                },
                'se': {
                    name: 'Sweden (Sverige)',
                    countryCode: 'se',
                    intlPrefix: '46'
                },
                'ch': {
                    name: 'Switzerland (Schweiz)',
                    countryCode: 'ch',
                    intlPrefix: '41'
                },
                'sy': {
                    name: 'Syria (‫سوريا‬‎)',
                    countryCode: 'sy',
                    intlPrefix: '963'
                },
                'tw': {
                    name: 'Taiwan (台灣)',
                    countryCode: 'tw',
                    intlPrefix: '886'
                },
                'tj': {
                    name: 'Tajikistan',
                    countryCode: 'tj',
                    intlPrefix: '992'
                },
                'tz': {
                    name: 'Tanzania',
                    countryCode: 'tz',
                    intlPrefix: '255'
                },
                'th': {
                    name: 'Thailand (ไทย)',
                    countryCode: 'th',
                    intlPrefix: '66'
                },
                'tl': {
                    name: 'Timor-Leste',
                    countryCode: 'tl',
                    intlPrefix: '670'
                },
                'tg': {
                    name: 'Togo',
                    countryCode: 'tg',
                    intlPrefix: '228'
                },
                'tk': {
                    name: 'Tokelau',
                    countryCode: 'tk',
                    intlPrefix: '690'
                },
                'to': {
                    name: 'Tonga',
                    countryCode: 'to',
                    intlPrefix: '676'
                },
                'tt': {
                    name: 'Trinidad and Tobago',
                    countryCode: 'tt',
                    intlPrefix: '1868'
                },
                'tn': {
                    name: 'Tunisia (‫تونس‬‎)',
                    countryCode: 'tn',
                    intlPrefix: '216'
                },
                'tr': {
                    name: 'Turkey (Türkiye)',
                    countryCode: 'tr',
                    intlPrefix: '90'
                },
                'tm': {
                    name: 'Turkmenistan',
                    countryCode: 'tm',
                    intlPrefix: '993'
                },
                'tc': {
                    name: 'Turks and Caicos Islands',
                    countryCode: 'tc',
                    intlPrefix: '1649'
                },
                'tv': {
                    name: 'Tuvalu',
                    countryCode: 'tv',
                    intlPrefix: '688'
                },
                'vi': {
                    name: 'U.S. Virgin Islands',
                    countryCode: 'vi',
                    intlPrefix: '1340'
                },
                'ug': {
                    name: 'Uganda',
                    countryCode: 'ug',
                    intlPrefix: '256'
                },
                'ua': {
                    name: 'Ukraine (Україна)',
                    countryCode: 'ua',
                    intlPrefix: '380'
                },
                'ae': {
                    name: 'United Arab Emirates (‫الإمارات العربية المتحدة‬‎)',
                    countryCode: 'ae',
                    intlPrefix: '971'
                },
                'gb': {
                    name: 'United Kingdom',
                    countryCode: 'gb',
                    intlPrefix: '44'
                },
                'us': {
                    name: 'United States',
                    countryCode: 'us',
                    intlPrefix: '1'
                },
                'uy': {
                    name: 'Uruguay',
                    countryCode: 'uy',
                    intlPrefix: '598'
                },
                'uz': {
                    name: 'Uzbekistan (Oʻzbekiston)',
                    countryCode: 'uz',
                    intlPrefix: '998'
                },
                'vu': {
                    name: 'Vanuatu',
                    countryCode: 'vu',
                    intlPrefix: '678'
                },
                'va': {
                    name: 'Vatican City (Città del Vaticano)',
                    countryCode: 'va',
                    intlPrefix: '39'
                },
                've': {
                    name: 'Venezuela',
                    countryCode: 've',
                    intlPrefix: '58'
                },
                'vn': {
                    name: 'Vietnam (Việt Nam)',
                    countryCode: 'vn',
                    intlPrefix: '84'
                },
                'wf': {
                    name: 'Wallis and Futuna',
                    countryCode: 'wf',
                    intlPrefix: '681'
                },
                'ye': {
                    name: 'Yemen (‫اليمن‬‎)',
                    countryCode: 'ye',
                    intlPrefix: '967'
                },
                'zm': {
                    name: 'Zambia',
                    countryCode: 'zm',
                    intlPrefix: '260'
                },
                'zw': {
                    name: 'Zimbabwe',
                    countryCode: 'zw',
                    intlPrefix: '263'
                }
            };
        }

    }
})();
