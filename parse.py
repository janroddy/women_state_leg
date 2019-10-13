import sys

filepath = sys.argv[1]
#filepath2 = sys.argv[2]

#fp2 = open(filepath2, 'w')

with open(filepath) as fp:
#	count = 0
	line = fp.readline()
	values = []

	for line in range(1, 51):
		line = fp.readline()
		line2 = line.split(",")
#		state = line2[0]
#		print (line2[1])

		val = line2[1]
		values.append(val)


 
print(values.min())
fp.close()
